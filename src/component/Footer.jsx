import logoSrc from "../assets/images/logo/payOS.png";
import logoSrc2 from "../assets/images/logo/vnpay.jpg";
import logoSrc3 from "../assets/images/logo/bocongthuong.png";

function Footer() {
    return (
        <footer className="bg-dark text-white py-5">
            <div className="container">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col mb-4">
                        <h5 href="#" className="mb-2 fw-bold">Hỗ trợ</h5>
                        <p> <i class="bi bi-calendar"></i> Thứ 2 - Thứ 6 (8:30 - 18:30)</p>
                        <a href="tel:0961774218" className="fw-bold mb-2" style={{ textDecoration: 'none', color: '#EC6C21' }}><i class="bi bi-telephone"></i> 0961774218</a>
                        <h5 className="mt-4 fw-bold">Email</h5>
                        <p class="text-white fw-bold"><i class="bi bi-envelope"></i> fpttickethub@gmail.com</p>
                    </div>

                    <div className="col mb-4">
                    <h5 className="mb-4 fw-bold">
                    <a href="/news" className="fw-bold mb-2" style={{ textDecoration: 'none', color: '#EC6C21' }}><i class="bi bi-newspaper"></i> Tin tức</a>
                    </h5>
                    <h5 className="mb-4 fw-bold">Dành cho Khách hàng</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="custom-link" style={{ textDecoration: 'none' }}>Điều khoản sử dụng cho khách hàng</a></li>
                        </ul>
                        <h5 className="mb-4 fw-bold">Dành cho Ban Tổ chức</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="custom-link" style={{ textDecoration: 'none' }}>Trở thành Ban Tổ chức</a></li>
                            <li><a href="#" className="custom-link" style={{ textDecoration: 'none' }}>Điều khoản sử dụng cho ban tổ chức</a></li>
                        </ul>
                    </div>
                    <div className="col mb-4">
                        <h5 className="mb-4 fw-bold">Về chúng tôi</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="custom-link" style={{ textDecoration: 'none' }}>Quy chế hoạt động</a></li>
                            <li><a href="#" className="custom-link" style={{ textDecoration: 'none' }}>Chính sách bảo mật thông tin</a></li>
                            <li><a href="#" className="custom-link" style={{ textDecoration: 'none' }}>Cơ chế giải quyết tranh chấp, khiếu nại</a></li>
                            <li><a href="#" className="custom-link" style={{ textDecoration: 'none' }}>Chính sách bảo mật thanh toán</a></li>
                            <li><a href="#" className="custom-link" style={{ textDecoration: 'none' }}>Chính sách đổi trả</a></li>
                            <li><a href="#" className="custom-link" style={{ textDecoration: 'none' }}>Điều kiện vận chuyển và giao nhận</a></li>
                            <li><a href="#" className="custom-link" style={{ textDecoration: 'none' }}>Phương thức thanh toán</a></li>
                            <li>                            
                                <img className="me-2" src={logoSrc} height={50} alt="logo" />
                                <img className="me-2" src={logoSrc2} height={50} alt="logo" />
                                <img src={logoSrc3} height={50} alt="logo" />


                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-center">
                    &copy;2024 FPTTicketHub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;