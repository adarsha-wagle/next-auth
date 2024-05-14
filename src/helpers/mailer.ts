import User from "@/models/userModel";
import nodemailer from "nodemailer";

import bcryptjs from "bcryptjs";
/**
 *
 * @param param0 {email,emailType,userId}
 * email = user email
 * emailType = verification / forgot password
 * userId = user id
 */

type TSendEmail = {
  email: string;
  emailType: string;
  userId: string;
};
export const sendEmail = async ({ email, emailType, userId }: TSendEmail) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 10 * 60 * 1000,
      });
    } else if (emailType === "RESET") {
      const hashedToken = await bcryptjs.hash(userId.toString(), 10);
      if (emailType === "RESET") {
        await User.findByIdAndUpdate(userId, {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 10 * 60 * 1000,
        });
      }
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d1a19273586ed1", // 🔥
        pass: "********b990",
      },
    });

    const mailOptions = {
      from: "awagle010@gmail.com.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your Email" : "Reset your Password",
      html: `<p>Click <a href = "${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType} your account</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (err: any) {
    throw new Error(err?.message);
  }
};
