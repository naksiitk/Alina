const otpGenerator = require('otp-generator');

// The OTP_LENGTH is a number, For my app i selected 10.
// The OTP_CONFIG is an object that looks like

OTP_CONFIG = {
    upperCaseAlphabets: true,
    specialChars: false,
}

OTP_LENGTH = 5

module.exports.generateOTP = () => {
  const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
  return OTP;
};
