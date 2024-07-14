
//~ MY Function to generate a random Otp 
export const generateOTP = () => {
  const otpLength = 6;
  let otp = '';

  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};

export default generateOTP;
