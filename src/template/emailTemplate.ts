import { transporter } from "../handler/mail";
import ejs from "ejs";
import path from 'path';



//Email for deposit to the client 
export async function sendDepositConfirmationEmail(depositDetails: any): Promise<void> {
    try {
        // Render the EJS template
        const templatePath = path.join(__dirname, '../../views/emailDeposit.ejs');
        const emailContent = await ejs.renderFile(templatePath, {
            amount: depositDetails.amount,
            plan: depositDetails.plan,
            name: depositDetails.user.userName,
        });

        // Compose the email
        const mailOptions = {
            from: "Eternal Trading <support@eternaltrading.org>",
            to: depositDetails.user.email,
            subject: 'Deposit Confirmation',
            html: emailContent,
        };

        // Send the email using the imported transporter
        await transporter.sendMail(mailOptions);
        console.log('Email sent: Deposit confirmation');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}



//Email for withdrawal to the client 
export async function sendWithdrawalConfirmationEmail(withdrawalDetails: any): Promise<void> {
    try {
        // Render the EJS template
        const templatePath = path.join(__dirname, '../../views/emailWithdrawal.ejs');
        const emailContent = await ejs.renderFile(templatePath, {
            amount: withdrawalDetails.amount,
            walletAddress: withdrawalDetails.walletAddress,
            name: withdrawalDetails.user.userName,
            batchId: withdrawalDetails.batch_id
        });

        // Compose the email
        const mailOptions = {
            from: "Eternal Trading <support@eternaltrading.org>",
            to: withdrawalDetails.user.email,
            subject: 'Withdrawal Confirmation',
            html: emailContent,
        };

        // Send the email using the imported transporter
        await transporter.sendMail(mailOptions);
        console.log('Email sent: Withdraw confirmation');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


//Email for withdrawal to the client 
export async function processingWithdrawal(withdrawalDetails: any): Promise<void> {
    try {
        // Render the EJS template
        const templatePath = path.join(__dirname, '../../views/withdrawalVerification.ejs');
        const emailContent = await ejs.renderFile(templatePath, {
            name: withdrawalDetails.user.userName,
        });

        // Compose the email
        const mailOptions = {
            from: "Eternal Trading <support@eternaltrading.org>",
            to: withdrawalDetails.user.email,
            subject: 'Withdrawal Processing',
            html: emailContent,
        };

        // Send the email using the imported transporter
        await transporter.sendMail(mailOptions);
        console.log('Email sent: Withdraw processing');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


export async function userRegistration(userDetails: any): Promise<void> {
    try {
        // Render the EJS template
        const templatePath = path.join(__dirname, '../../views/verifyemail.ejs');
        const emailContent = await ejs.renderFile(templatePath, {
            name: userDetails.userName,
        });

        // Compose the email
        const mailOptions = {
            from: "Eternal Trading <support@eternaltrading.org>",
            to: userDetails.email,
            subject: 'Welcome to Eternal Trading',
            html: emailContent,
        };

        // Send the email using the imported transporter
        await transporter.sendMail(mailOptions);
        console.log('Email sent: Withdraw processing');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


