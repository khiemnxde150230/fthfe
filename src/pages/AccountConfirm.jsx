import { useParams } from "react-router-dom";
import { ConfirmAccountService } from "../services/UserService";
import { Container, Alert } from "react-bootstrap";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { useEffect, useState } from "react";
import { Result } from "antd";

export default function ConfirmAccount() {
    const { email } = useParams();
    const [confirmationStatus, setConfirmationStatus] = useState(null);


    useEffect(() => {
        const confirmAccount = async () => {
            try {
                const result = await ConfirmAccountService(email);
                setConfirmationStatus(result.status);
            } catch (error) {
                console.error("Error confirming account:", error);
            }
        };

        if (email !== undefined) {
            confirmAccount();
        }
    }, [email]);

    return (
        <>
            <Header />
            <div className="bg bg-light">
                {confirmationStatus === 404 && (
                    <Result
                        status="error"
                        title="Xác thực tài khoản không thành công"
                        subTitle="Hãy liên hệ fpttickethub@gmail.com để được hỗ trợ"
                    />
                )}
                {confirmationStatus === 200 && (
                    <Result
                        status="success"
                        title="Xác thực tài khoản thành công"
                        subTitle="Bây giờ bạn đã có thể đăng nhập!"
                    />
                )}
            </div>
            <Footer />
        </>
    );
}