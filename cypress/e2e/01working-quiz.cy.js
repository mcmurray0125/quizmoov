describe('template spec', () => {
  it('performs end-to-end flow', () => {
    cy.visit('/login');

    // Attempt to go Home when not logged in
    cy.contains('Home').click();

    // Login Error message is displayed
    cy.get('.login-message').should('be.visible');

    cy.get('#demo-button').click();
    cy.wait(2500);

    // Wait for the quiz options to load
    cy.get('.radio-btn').should('have.length', 4);

    // Select a quiz option
    cy.get('.radio-btn input').first().check({force: true});

    // Submit and get results
    cy.get('.submit-btn').click();
    cy.wait(2200);

    // Verify the message based on the correct/wrong guess
    cy.get('.result-message').then(($message) => {
      if ($message.text().includes('Nice!')) {
        // Assertion for a correct guess
        cy.get('#tsparticles canvas').should('exist');
      } else {
        // Assertion for a wrong guess
        cy.get('#tsparticles canvas').should('not.exist');
      }
    });

    // Generate new Quiz
    cy.get('.submit-btn').click();
    
    // Wait for the new quiz options to load
    cy.get('.radio-btn').should('have.length', 4);
    cy.wait(2200);

    // Select another quiz option
    cy.get('.radio-btn input').first().check({force: true});

    // Submit and get results again
    cy.get('.submit-btn').click();
    cy.wait(2200);

    // Wait for the form submission and results message to appear
    cy.get('.result-message').should('be.visible');

    // Verify the message based on the correct/wrong guess
    cy.get('.result-message').then(($message) => {
      if ($message.text().includes('Nice!')) {
        // Assertion for a correct guess
        cy.get('#tsparticles canvas').should('exist');
      } else {
        // Assertion for a wrong guess
        cy.get('#tsparticles canvas').should('not.exist');
      }
    });

    // Generate new Quiz
    cy.get('.submit-btn').click();
    
    // Wait for the new quiz options to load
    cy.get('.radio-btn').should('have.length', 4);
    cy.wait(2200);

    // Click the "Results" link to navigate to the results page
    cy.contains('Results').click();

    // Wait for the results page to load
    cy.url().should('include', '/results');
    cy.wait(2200)

    // Assertions on the results page
    cy.get('#results-section').should('be.visible');

    // Click the dropdown menu
    cy.get('#collapsible-nav-dropdown').click();

    // Click the "My Account" link to navigate to the My Account page
    cy.contains('My Account').click();

    // Wait for the My Account page to load
    cy.url().should('include', '/account');
    cy.wait(2200)

    cy.get('.profile-summary').should('be.visible');

    // Check the quiz counter
    cy.get('#quiz-counter').should('contain', 'Total Quizzes: 2');

    // Click the dropdown menu
    cy.get('#collapsible-nav-dropdown').click();

    // Click the "Logout" button
    cy.contains('Logout').click();

    // Login page with login button is displayed
    cy.get('.login-button').should('be.visible');
  });
});
