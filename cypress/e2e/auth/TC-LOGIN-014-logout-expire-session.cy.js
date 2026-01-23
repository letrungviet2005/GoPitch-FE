describe("TC-LOGIN-014: Logout expire session", () => {
  it("Should redirect to signin after logout from profile page", () => {
    // 1. Thực hiện đăng nhập
    cy.visit("/signin");
    cy.get('input[type="email"]').type("Vitprofb@gmail.com"); // Dùng account test của bạn
    cy.get('input[type="password"]').type("123456789");
    cy.contains("button", "Đăng nhập").click();

    // 2. Chờ đăng nhập thành công và điều hướng vào trang chủ/dashboard
    cy.url().should("not.include", "/signin");

    // 3. Truy cập vào trang Profile (đúng route của component Profile)
    cy.visit("/profile");

    // Đợi profile load xong (check sự tồn tại của nút đăng xuất)
    cy.get("button").contains("Đăng xuất").should("be.visible");

    // 4. Nhấn nút Đăng xuất
    cy.contains("button", "Đăng xuất").click();

    // 5. Kiểm tra đã quay về trang signin chưa
    cy.url().should("include", "/signin");

    // 6. Kiểm tra bảo mật: Thử quay lại trang profile xem có bị đá ra không
    cy.visit("/profile");
    cy.url().should("include", "/signin");

    // 7. Kiểm tra Storage đã sạch chưa
    cy.window().then((win) => {
      expect(win.localStorage.getItem("accessToken")).to.be.null;
      expect(win.sessionStorage.getItem("accessToken")).to.be.null;
    });
  });
});
