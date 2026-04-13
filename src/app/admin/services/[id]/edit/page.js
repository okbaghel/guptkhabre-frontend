"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateService } from "@/services/serviceService";
import { apiClient } from "@/services/apiClient";

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    profile: "",
    description: "",
    mobile: "",
    whatsapp: "",
    isActive: true,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD SERVICE DATA
  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient("/services");
        const service = data.services.find((s) => s._id === id);

        if (service) {
          setForm({
            name: service.name,
            profile: service.profile,
            description: service.description,
            mobile: service.mobile,
            whatsapp: service.whatsapp,
            isActive: service.isActive,
          });

          setPreview(service.imageUrl);
        }
      } catch (err) {
        alert("Failed to load service");
      }
    };

    load();
  }, [id]);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 IMAGE PREVIEW
  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);

    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  };

  // 🔥 SUBMIT UPDATE
  const handleSubmit = async () => {
    setLoading(true);

    try {
      await updateService(id, { ...form, file });

      alert("Service updated successfully");
      router.push("/admin/services");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Edit Service</h1>

      {/* Image Preview */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-32 object-cover rounded mb-4"
        />
      )}

      {/* File */}
      <input type="file" onChange={handleFile} className="mb-4" />

      {/* Name */}
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full border p-2 mb-3"
      />

      {/* Profile */}
      <input
        name="profile"
        value={form.profile}
        onChange={handleChange}
        placeholder="Profile"
        className="w-full border p-2 mb-3"
      />

      {/* Description */}
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border p-2 mb-3"
      />

      {/* Mobile */}
      <input
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        placeholder="Mobile"
        className="w-full border p-2 mb-3"
      />

      {/* WhatsApp */}
      <input
        name="whatsapp"
        value={form.whatsapp}
        onChange={handleChange}
        placeholder="WhatsApp"
        className="w-full border p-2 mb-3"
      />

      {/* Status Toggle */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Status:</label>
        <select
          name="isActive"
          value={form.isActive}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              isActive: e.target.value === "true",
            }))
          }
          className="border p-2"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Updating..." : "Update Service"}
      </button>
    </div>
  );
}