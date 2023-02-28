describe('template spec', () => {
  it('visits login page', () => {
    cy.visit('/login')
    cy.get('#demo-button').click()
  })
})