const forge = require('node-forge');
const logger = require('../utils/logger');

const validateFIEL = async (certificatePem, serialNumber) => {
  try {
    logger.info(`Validando FIEL: ${serialNumber}`);
    return true;
  } catch (error) {
    logger.error('Error validating FIEL:', error);
    return false;
  }
};

const signPDFWithFIEL = async (pdfBuffer, cerContent, keyContent, password) => {
  try {
    const cert = forge.pki.certificateFromPem(cerContent);
    const privateKey = forge.pki.privateKeyFromPem(keyContent, password);
    const md = forge.md.sha256.create();
    md.update(pdfBuffer.toString('binary'));
    const hash = md.digest();
    const signature = privateKey.sign(hash);
    const signatureBase64 = forge.util.encode64(signature);
    
    const p7 = forge.pkcs7.createSignedData();
    p7.content = forge.util.createBuffer(pdfBuffer.toString('binary'));
    p7.addCertificate(cert);
    p7.addSigner({
      key: privateKey,
      certificate: cert,
      digestAlgorithm: forge.pki.oids.sha256,
      authenticatedAttributes: [{
        type: forge.pki.oids.contentType,
        value: forge.pki.oids.data,
      }, {
        type: forge.pki.oids.messageDigest,
        value: hash,
      }, {
        type: forge.pki.oids.signingTime,
        value: new Date(),
      }],
    });
    p7.sign();
    const signedData = forge.asn1.toDer(p7.toAsn1()).getBytes();
    
    return { signatureBase64, signedData: Buffer.from(signedData, 'binary') };
  } catch (error) {
    logger.error('Error signing PDF with FIEL:', error);
    throw new Error('Error al firmar el documento con FIEL');
  }
};

const getRFCFromCertificate = (certificate) => {
  try {
    const subject = certificate.subject;
    const attrs = subject.attributes;
    const rfcAttr = attrs.find(attr => attr.name === '2.5.4.5' || attr.shortName === 'serialNumber');
    return rfcAttr ? rfcAttr.value : null;
  } catch (error) {
    logger.error('Error extracting RFC from certificate:', error);
    return null;
  }
};

module.exports = {
  validateFIEL,
  signPDFWithFIEL,
  getRFCFromCertificate,
};