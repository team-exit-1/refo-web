import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useElderStore } from '../stores/elderStore';

export default function ElderRegistration() {
  const navigate = useNavigate();
  const setCurrentElder = useElderStore((state) => state.setCurrentElder);

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    relation: '',
    phone: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: API 호출하여 어르신 등록
    const newElder = {
      elder_id: 'elder_' + Date.now(),
      name: formData.name,
      date_of_birth: formData.birthDate,
      diagnosis_info: '',
      assigned_caregivers: [],
    };

    setCurrentElder(newElder);
    navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary-medium/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.svg" alt="Refo" className="h-16" />
          </div>
          <h1 className="text-h1 font-bold text-neutral-gray-dark mb-2">
            어르신 등록
          </h1>
          <p className="text-body text-neutral-gray-medium">
            돌봄을 받으실 어르신의 정보를 입력해주세요
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-semibold text-neutral-gray-dark mb-2">
                이름 <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="예) 김영희"
                className="input-field w-full"
              />
            </div>

            {/* 생년월일 */}
            <div>
              <label className="block text-sm font-semibold text-neutral-gray-dark mb-2">
                생년월일 <span className="text-error">*</span>
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className="input-field w-full"
              />
            </div>

            {/* 관계 */}
            <div>
              <label className="block text-sm font-semibold text-neutral-gray-dark mb-2">
                관계 <span className="text-error">*</span>
              </label>
              <select
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                required
                className="input-field w-full"
              >
                <option value="">선택해주세요</option>
                <option value="부모">부모님</option>
                <option value="조부모">조부모님</option>
                <option value="친척">친척</option>
                <option value="기타">기타</option>
              </select>
            </div>

            {/* 연락처 */}
            <div>
              <label className="block text-sm font-semibold text-neutral-gray-dark mb-2">
                연락처
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
                className="input-field w-full"
              />
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-semibold text-neutral-gray-dark mb-2">
                주소
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="서울시 강남구..."
                className="input-field w-full"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary flex-1"
              >
                나중에 하기
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                등록 완료
              </button>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-gray-medium">
            💡 등록한 정보는 언제든지 수정할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
