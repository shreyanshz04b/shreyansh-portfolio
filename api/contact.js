import nodemailer from "nodemailer";

export default async function handler(req, res) {
  console.log("API HIT");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  console.log("BODY:", req.body);
  console.log("ENV USER:", process.env.EMAIL_USER);
  console.log("ENV PASS EXISTS:", !!process.env.EMAIL_PASS);

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


    await transporter.verify();
    console.log("Tr--ansport verified");

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: message,
    });

    console.log("Email sent");

    return res.status(200).json({ message: "Email Sent Successfully" });

  } catch (error) {
    console.error("FULL ERROR:", error);
    return res.status(500).json({ message: "Email Failed", error: error.message });
  }
}
