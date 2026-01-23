describe("TC-LOGIN-007: Remember me", () => {
  it("Save session when remember checked", () => {
    cy.visit("/signin");

    cy.get('input[type="email"]').type("vietlt.23it@vku.udn.vn");
    cy.get('input[type="password"]').type("123456789");
    cy.get('input[type="checkbox"]').check();
    cy.contains("button", "Đăng nhập").click();

    // CHỖ QUAN TRỌNG: Phải đợi nó đăng nhập xong và chuyển hướng lần 1 đã
    cy.url().should("not.include", "/signin");

    // Kiểm tra xem localStorage đã có token chưa
    cy.window().then((win) => {
      expect(win.localStorage.getItem("accessToken")).to.be.a("string");
    });

    // Bây giờ mới reload
    cy.reload();

    // Kiểm tra lại lần nữa sau khi reload
    cy.url().should("not.include", "/signin");
  });
});
