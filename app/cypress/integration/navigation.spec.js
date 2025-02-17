describe('Navigation', () => {
  it('should visit root', () => {
    cy.visit('/');
  });
  it('Should Find Test Tuesday and Click on it ', () => {
    cy.visit('/')
      .contains('[data-testid=day]', 'Tuesday')
      .click()
      .should('have.class', 'day-list__item--selected');
  });
});
describe('Appointments', () => {
  beforeEach(() => {
    cy.request('GET', '/api/debug/reset');
    cy.visit('/');
    cy.contains('Monday');
  });

  it('Should Book an Interview', () => {
    cy.get('[alt=Add]').first().click();
    cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones');
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains('Save').click();
    cy.contains('Saving').should('exist');
    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Sylvia Palmer');
  });

  it('Should Edit and Interview', () => {
    cy.get('[alt=Edit]').first().click({ force: true });
    cy.get('[data-testid=student-name-input]').clear().type('Quinten Aiton');
    cy.get("[alt='Tori Malcolm']").click();
    cy.contains('Save').click();
    cy.contains('Saving').should('exist');
    cy.contains('.appointment__card--show', 'Quinten Aiton');
    cy.contains('.appointment__card--show', 'Tori Malcolm');
  });
  it('Should Remove an Interview', () => {
    cy.get('[alt=Delete]').first().click({ force: true });
    cy.contains('Confirm').click();
    cy.contains('Deleting').should('exist');
    cy.get('[data-testid=appointment]')
      .first()
      .get('[alt=Add')
      .should('be.visible');
  });
});
