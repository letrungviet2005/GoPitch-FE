describe("TC-LOGIN-004: Empty email and password", () => {
  it("Show required validation", () => {
    cy.visit("/signin");

    cy.contains("button", "Đăng nhập").click();

    cy.contains("Vui lòng nhập");
  });
});
