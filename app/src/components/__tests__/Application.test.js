import React from 'react';
import axios from 'axios';

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  getByDisplayValue,
} from '@testing-library/react';

import Application from 'components/Application';

afterEach(cleanup);

describe('Application Component', () => {
  it('changes the schedule when a new day is selected', async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText('Tuesday'));

    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });

  it('loads data, books an interview and reduces the spots remaining for Monday by 1', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment')[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving Interview')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    const days = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(days, 'no spots remaining')).toBeInTheDocument();
  });

  it('Loads data, cancels an interview  and increases spots remaining for Monday by 1', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const days = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(days, '1 spot remaining')).toBeInTheDocument;

    const appointment = getAllByTestId(container, 'appointment')[1];

    fireEvent.click(getByAltText(appointment, 'Delete'));
    expect(
      getByText(appointment, 'Are you Sure You Want to Delete This Interview?')
    );
    fireEvent.click(getByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'Deleting Interview')).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, 'Add'));

    expect(getByText(days, '2 spots remaining')).toBeInTheDocument;
  });

  it('Loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const days = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(days, '1 spot remaining')).toBeInTheDocument;

    const appointment = getAllByTestId(container, 'appointment')[1];

    fireEvent.click(getByAltText(appointment, 'Edit'));

    fireEvent.change(getByDisplayValue(appointment, 'Archie Cohen'), {
      target: { value: 'Quinten Aiton' },
    });
    expect(getByDisplayValue(appointment, 'Quinten Aiton').toBeInTheDocument);

    fireEvent.click(getByAltText(appointment, 'Tori Malcolm'));

    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving Interview')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Quinten Aiton'));

    expect(getByText(days, '1 spot remaining')).toBeInTheDocument();
  });

  it('shows the save error when failing to save an appointment', async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment')[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving Interview')).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, 'Sorry We Were Not Able To Create the Appointment')
    );

    expect(
      getByText(appointment, 'Sorry We Were Not Able To Create the Appointment')
    ).toBeInTheDocument();
  });

  it('Shows the delete error when failing to delete an existing appointment', async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const days = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(days, '1 spot remaining')).toBeInTheDocument;

    const appointment = getAllByTestId(container, 'appointment')[1];

    fireEvent.click(getByAltText(appointment, 'Delete'));

    expect(
      getByText(appointment, 'Are you Sure You Want to Delete This Interview?')
    );

    fireEvent.click(getByText(appointment, 'Confirm'));
    expect(getByText(appointment, 'Deleting Interview')).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, 'Sorry We Were Not Able To Delete the Appointment')
    );

    expect(
      getByText(appointment, 'Sorry We Were Not Able To Delete the Appointment')
    ).toBeInTheDocument();
  });
});
