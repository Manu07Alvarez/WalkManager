import React, { useState } from 'react';
import { registerWalkerSchema, RegisterWalkerInput } from '../api/authApi';

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegisterWalkerInput>({
    full_name: '',
    email: '',
    phone_number: '',
    cuil: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerWalkerSchema.safeParse(formData);
    if (result.success) {
      alert('Registration successful!');
    } else {
      alert('Validation error: ' + result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold">Register as Dog Walker</h2>
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">CUIL</label>
        <input
          type="text"
          value={formData.cuil}
          onChange={(e) => setFormData({ ...formData, cuil: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-semibold">
        Submit Registration
      </button>
    </form>
  );
}
