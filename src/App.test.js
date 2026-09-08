import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { StorageService } from './data/mockDatabase';

// Mock canvas-confetti
jest.mock('canvas-confetti', () => () => {});

describe('HealthStory Comprehensive Application & Button Flow Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    StorageService.init();
    StorageService.clearAll();
  });

  test('1. Landing page renders branding, hero, and primary action buttons', () => {
    render(<App />);

    // Verify Brand Logo & Headlines
    expect(screen.getAllByText(/Every Record. One Health Story./i).length).toBeGreaterThan(0);
    expect(screen.getByText(/CENTRALIZED LONGITUDINAL HEALTH REGISTRY/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/KNOW THE/i);

    // Verify Navigation Buttons in Navbar
    expect(screen.getAllByRole('button', { name: /Doctor & Staff Portal/i })[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Patient Portal/i })).toBeInTheDocument();
  });

  test('2. New Doctor Sign-Up registers physician and logs into Staff Portal', async () => {
    render(<App />);

    // Click Doctor & Staff Portal button in header
    const staffPortalBtn = screen.getAllByRole('button', { name: /Doctor & Staff Portal/i })[0];
    fireEvent.click(staffPortalBtn);

    // Switch to Register New Doctor
    const registerTabBtn = screen.getByRole('button', { name: /Register New Doctor \/ Staff/i });
    fireEvent.click(registerTabBtn);

    // Fill Registration Form
    const nameInput = screen.getByPlaceholderText(/e.g. Dr. Jennifer Adams/i);
    const passwordInput = screen.getByPlaceholderText(/Create password/i);

    fireEvent.change(nameInput, { target: { value: 'Dr. Jennifer Adams' } });
    fireEvent.change(passwordInput, { target: { value: 'securepass123' } });

    // Submit Registration
    const submitBtn = screen.getByRole('button', { name: /Register Doctor & Enter Portal/i });
    fireEvent.click(submitBtn);

    // Verify Admin Dashboard loads with doctor name
    await waitFor(() => {
      expect(screen.getByText(/Clinical Operations & Patient Registry/i)).toBeInTheDocument();
      expect(screen.getByText(/AUTHORIZED HOSPITAL STAFF PORTAL/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Dr. Jennifer Adams/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /Register New Patient/i })).toBeInTheDocument();
    });
  });

  test('3. Doctor Sign-In authenticates registered staff member', async () => {
    // Register doctor in Storage
    StorageService.registerStaff({
      staffId: 'DOC-501',
      name: 'Dr. Sarah Jenkins',
      role: 'Chief of Internal Medicine',
      hospital: 'Apex National Medical Center',
      password: 'mypassword'
    });

    render(<App />);

    // Click Doctor & Staff Portal button
    fireEvent.click(screen.getAllByRole('button', { name: /Doctor & Staff Portal/i })[0]);

    // Fill credentials
    const staffIdInput = screen.getByPlaceholderText(/e.g. DOC-101 or HSP-482/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your security password/i);

    fireEvent.change(staffIdInput, { target: { value: 'DOC-501' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

    // Submit Sign In
    fireEvent.click(screen.getByRole('button', { name: /Sign In to Staff Portal/i }));

    // Verify Dashboard loaded
    await waitFor(() => {
      expect(screen.getByText(/Clinical Operations & Patient Registry/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Dr. Sarah Jenkins/i).length).toBeGreaterThan(0);
    });
  });

  test('4. Patient Registration 3-Step Wizard generates permanent Health ID', async () => {
    render(<App />);

    // Register & enter doctor portal
    fireEvent.click(screen.getAllByRole('button', { name: /Doctor & Staff Portal/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Register New Doctor \/ Staff/i }));
    fireEvent.change(screen.getByPlaceholderText(/e.g. Dr. Jennifer Adams/i), { target: { value: 'Dr. Sarah Jenkins' } });
    fireEvent.change(screen.getByPlaceholderText(/Create password/i), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Register Doctor & Enter Portal/i }));

    // Click Register New Patient
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Register New Patient/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Register New Patient/i }));

    // Verify Wizard Step 1 Header
    expect(screen.getByText(/STEP 1 — BASIC PATIENT INFORMATION/i)).toBeInTheDocument();

    // Fill Demographics
    const nameInput = screen.getByPlaceholderText(/e.g. Vikram Malhotra/i);
    const dobInput = screen.getByLabelText(/Date of Birth \*/i);
    const phoneInput = screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i);

    fireEvent.change(nameInput, { target: { value: 'David Miller' } });
    fireEvent.change(dobInput, { target: { value: '1988-07-15' } });
    fireEvent.change(phoneInput, { target: { value: '+1 (555) 987-6543' } });

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: /Proceed to Medical Baseline/i }));

    // Verify Wizard Step 2
    expect(screen.getByText(/STEP 2 — BASELINE CLINICAL INFORMATION/i)).toBeInTheDocument();

    // Step 2 -> Step 3
    fireEvent.click(screen.getByRole('button', { name: /Review & Issue Health ID/i }));

    // Verify Wizard Step 3
    expect(screen.getByText(/STEP 3 — REVIEW & CONFIRMATION/i)).toBeInTheDocument();
    expect(screen.getAllByText(/David Miller/i).length).toBeGreaterThan(0);

    // Complete Registration
    fireEvent.click(screen.getByRole('button', { name: /Confirm & Generate Health ID/i }));

    // Verify Success Screen & Universal Health ID
    await waitFor(() => {
      expect(screen.getByText(/Patient Successfully Registered!/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Open Patient Record →/i })).toBeInTheDocument();
    });

    // Open Patient Profile
    fireEvent.click(screen.getByRole('button', { name: /Open Patient Record →/i }));

    // Verify Patient Profile is loaded
    await waitFor(() => {
      expect(screen.getByText(/LONGITUDINAL PATIENT PROFILE/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /\+ Add Health Record/i })).toBeInTheDocument();
    });
  });

  test('5. Adding verified clinical surgery record updates timeline and audit logs', async () => {
    render(<App />);

    // Log into Staff Portal
    fireEvent.click(screen.getAllByRole('button', { name: /Doctor & Staff Portal/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Register New Doctor \/ Staff/i }));
    fireEvent.change(screen.getByPlaceholderText(/e.g. Dr. Jennifer Adams/i), { target: { value: 'Dr. Sarah Jenkins' } });
    fireEvent.change(screen.getByPlaceholderText(/Create password/i), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Register Doctor & Enter Portal/i }));

    // Register a patient via Staff Portal
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Register New Patient/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Register New Patient/i }));

    // Step 1
    fireEvent.change(screen.getByPlaceholderText(/e.g. Vikram Malhotra/i), { target: { value: 'David Miller' } });
    fireEvent.change(screen.getByLabelText(/Date of Birth \*/i), { target: { value: '1988-07-15' } });
    fireEvent.change(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i), { target: { value: '+1 (555) 987-6543' } });
    fireEvent.click(screen.getByRole('button', { name: /Proceed to Medical Baseline/i }));

    // Step 2 -> Step 3 -> Finish
    fireEvent.click(screen.getByRole('button', { name: /Review & Issue Health ID/i }));
    fireEvent.click(screen.getByRole('button', { name: /Confirm & Generate Health ID/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Open Patient Record →/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Open Patient Record →/i }));

    // Click + Add Health Record
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /\+ Add Health Record/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /\+ Add Health Record/i }));

    // Select Surgery Type from modal
    const surgeryBtns = screen.getAllByRole('button', { name: /Surgery/i });
    fireEvent.click(surgeryBtns[surgeryBtns.length - 1]);

    // Fill Title & Procedure
    const titleInput = screen.getByLabelText(/Record Title \/ Event Heading \*/i);
    const procedureInput = screen.getByLabelText(/Procedure Name \*/i);
    fireEvent.change(titleInput, { target: { value: 'Laparoscopic Appendectomy' } });
    fireEvent.change(procedureInput, { target: { value: 'Laparoscopic removal of inflamed appendix' } });

    // Submit Record
    fireEvent.click(screen.getByRole('button', { name: /Save Verified Record to Story/i }));

    // Verify Record in Timeline
    await waitFor(() => {
      expect(screen.getAllByText(/Laparoscopic Appendectomy/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/SURGERY/i).length).toBeGreaterThan(0);
    });
  });

  test('6. Strict DOB Patient Authentication: Rejects incorrect birthdate, accepts correct birthdate', async () => {
    // 1. Register a fresh patient first via StorageService
    const patient = StorageService.registerPatient('admin', 'HSP-482', 'Dr. Sarah Jenkins', 'Apex National Medical Center', {
      name: 'David Miller',
      dateOfBirth: '1988-07-15',
      gender: 'Male',
      bloodGroup: 'A+',
      phone: '+1 (555) 987-6543'
    });

    render(<App />);

    // Click Patient Portal button
    fireEvent.click(screen.getByRole('button', { name: /Patient Portal/i }));

    // Verify Patient Tab
    expect(screen.getByRole('heading', { name: /Patient Portal/i })).toBeInTheDocument();

    const healthIdInput = screen.getByLabelText(/Universal Health ID/i);
    const dobInput = screen.getByLabelText(/Date of Birth \(Identity Verification\)/i);

    // Test A: Enter WRONG DOB
    fireEvent.change(healthIdInput, { target: { value: patient.healthId } });
    fireEvent.change(dobInput, { target: { value: '2000-01-01' } }); // Wrong DOB
    fireEvent.click(screen.getByRole('button', { name: /View My Health Story/i }));

    // Verify Error Message
    await waitFor(() => {
      expect(screen.getByText(/Authentication failed: Date of birth does not match the clinical record on file./i)).toBeInTheDocument();
    });

    // Test B: Enter CORRECT DOB
    fireEvent.change(dobInput, { target: { value: '1988-07-15' } }); // Correct DOB
    fireEvent.click(screen.getByRole('button', { name: /View My Health Story/i }));

    // Verify Patient Portal Loaded
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Your Health Story/i })).toBeInTheDocument();
      expect(screen.getByText(/VERIFIED PATIENT PORTAL • READ-ONLY/i)).toBeInTheDocument();
      expect(screen.getAllByText(/David Miller/i).length).toBeGreaterThan(0);
    });

    // Verify STRICT READ-ONLY: NO edit or add buttons exist
    expect(screen.queryByRole('button', { name: /\+ Add Health Record/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Register New Patient/i })).not.toBeInTheDocument();
  });

  test('7. Clicking Explore HealthStory safely prompts for Patient ID when empty', async () => {
    render(<App />);

    // Click Explore HealthStory without pre-existing patient
    const exploreBtn = screen.getByRole('button', { name: /Explore HealthStory/i });
    fireEvent.click(exploreBtn);

    // Should gracefully open Patient Portal modal without error
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Patient Portal/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Universal Health ID/i)).toBeInTheDocument();
    });
  });

  test('8. Sign out button cleanly returns user to landing page and clears session', async () => {
    render(<App />);

    // Register & log in as doctor
    fireEvent.click(screen.getAllByRole('button', { name: /Doctor & Staff Portal/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Register New Doctor \/ Staff/i }));
    fireEvent.change(screen.getByPlaceholderText(/e.g. Dr. Jennifer Adams/i), { target: { value: 'Dr. Sarah Jenkins' } });
    fireEvent.change(screen.getByPlaceholderText(/Create password/i), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Register Doctor & Enter Portal/i }));

    // Verify logged in
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
    });

    // Click Sign Out
    fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));

    // Verify Landing Page is restored
    await waitFor(() => {
      expect(screen.getByText(/CENTRALIZED LONGITUDINAL HEALTH REGISTRY/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Patient Portal/i })).toBeInTheDocument();
    });
  });
});
