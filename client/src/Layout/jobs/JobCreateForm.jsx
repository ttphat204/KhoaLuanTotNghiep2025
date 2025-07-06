import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import vietnamProvinces from '../../assets/vietnam_provinces';

const jobTypeOptions = [
  { value: "Full-time", label: "Toàn thời gian" },
  { value: "Part-time", label: "Bán thời gian" },
  { value: "Remote", label: "Làm từ xa" },
  { value: "Internship", label: "Thực tập" },
  { value: "Contract", label: "Hợp đồng" },
];

export default function JobCreateForm({ onSubmit, categories = [] }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm();

  const [provinces] = useState(vietnamProvinces);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log('description:', data.description);
        console.log('jobRequirements:', data.jobRequirements);
        onSubmit(data);
      })}
      className="bg-white rounded-2xl shadow-2xl p-8 max-w-[900px] w-full mx-4 space-y-8"
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Thông tin cơ bản</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Tiêu đề tin tuyển dụng *</label>
          <input {...register("jobTitle", { required: true })} className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition" placeholder="Vị trí hiển thị đăng tuyển" />
          {errors.jobTitle && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Ngành nghề *</label>
          <select {...register("categoryId", { required: true })} className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition" defaultValue="">
            <option value="" disabled>Chọn ngành nghề</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">Mô tả công việc *</label>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                className="bg-white rounded-lg"
                placeholder="Nhập mô tả chi tiết công việc"
                style={{ minHeight: 120 }}
              />
            )}
          />
          {errors.description && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">Yêu cầu công việc *</label>
          <Controller
            name="jobRequirements"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                className="bg-white rounded-lg"
                placeholder="Nhập yêu cầu chi tiết cho công việc"
                style={{ minHeight: 120 }}
              />
            )}
          />
          {errors.jobRequirements && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Kinh nghiệm *</label>
          <input {...register("experienceLevel", { required: true })} className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition" placeholder="VD: 2-3 năm kinh nghiệm" />
          {errors.experienceLevel && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Số lượng tuyển *</label>
          <input type="number" {...register("quantity", { required: true, min: 1 })} className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition" placeholder="Chỉ nhập số. VD: 10" />
          {errors.quantity && <span className="text-red-500 text-sm">Bắt buộc &gt; 0</span>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Hạn nộp hồ sơ *</label>
          <input type="date" {...register("applicationDeadline", { required: true })} className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition" />
          {errors.applicationDeadline && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
      </div>
      <h3 className="font-semibold text-lg mt-2 mb-2 text-gray-800">Địa chỉ 1</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Tỉnh / Thành phố *</label>
          <select
            {...register("province", { required: true })}
            className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition"
            defaultValue=""
          >
            <option value="" disabled>Chọn Tỉnh hoặc Thành phố</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.name}>{p.name}</option>
            ))}
          </select>
          {errors.province && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Quận / Huyện</label>
          <input {...register("district")} className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition" placeholder="(Không bắt buộc)" />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Số nhà, tên đường</label>
          <input {...register("addressDetail")} className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition" placeholder="(Không bắt buộc)" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-6 mb-2 text-gray-800">Yêu cầu chung</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Hình thức làm việc *</label>
          <select {...register("jobType", { required: true })} className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition">
            <option value="">Chọn hình thức làm việc</option>
            {jobTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {errors.jobType && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Cấp bậc *</label>
          <input {...register("level", { required: true })} className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition" placeholder="VD: Nhân viên, Trưởng nhóm, Quản lý..." />
          {errors.level && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Lương tối thiểu *</label>
            <input type="number" {...register("salaryMin", { required: true, min: 0 })} className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition" placeholder="0" />
            {errors.salaryMin && <span className="text-red-500 text-sm">Bắt buộc</span>}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Lương tối đa *</label>
            <div className="flex items-center">
              <input type="number" {...register("salaryMax", { required: true, min: 0 })} className="w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 px-4 py-2 transition" placeholder="0" />
              <span className="ml-2">Triệu</span>
            </div>
            {errors.salaryMax && <span className="text-red-500 text-sm">Bắt buộc</span>}
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-8 py-3 rounded-lg shadow transition-all text-lg">
          Tạo tin tuyển dụng
        </button>
      </div>
    </form>
  );
} 