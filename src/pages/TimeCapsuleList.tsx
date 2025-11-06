import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTimeCapsules } from '../hooks/useApi';
import { useElderStore } from '../stores/elderStore';
import { useTimeCapsuleStore } from '../stores/timeCapsuleStore';

const emotionColors: Record<string, string> = {
  행복: 'bg-yellow-100 text-yellow-800',
  그리움: 'bg-purple-100 text-purple-800',
  평온: 'bg-blue-100 text-blue-800',
  기대: 'bg-green-100 text-green-800',
  감사: 'bg-pink-100 text-pink-800',
};

export default function TimeCapsuleList() {
  const currentElder = useElderStore((state) => state.currentElder);
  const { data: capsules } = useTimeCapsules(currentElder?.elder_id || '');
  const { filterCategory, sortOrder, setFilterCategory, setSortOrder, toggleFavorite } =
    useTimeCapsuleStore();

  const [searchQuery, setSearchQuery] = useState('');

  // 필터링 및 정렬
  const filteredCapsules = capsules
    ?.filter((capsule) => {
      if (filterCategory && capsule.topic_category !== filterCategory) {
        return false;
      }
      if (searchQuery && !capsule.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_date).getTime();
      const dateB = new Date(b.created_date).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

  const categories = ['가족', '취미', '일상', '추억', '기타'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-neutral-gray-dark">타임캡슐</h1>
          <p className="text-body text-neutral-gray-medium mt-1">
            소중한 순간을 영원히 보존하세요
          </p>
        </div>
        <Link to="/timecapsule/create" className="btn-primary">
          + 새 캡슐 만들기
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="제목으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-neutral-gray-medium hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-neutral-gray-medium hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
            className="input-field"
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된 순</option>
          </select>
        </div>
      </div>

      {/* Capsule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCapsules && filteredCapsules.length > 0 ? (
          filteredCapsules.map((capsule) => (
            <Link
              key={capsule.capsule_id}
              to={`/timecapsule/${capsule.capsule_id}`}
              className="card p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 relative group"
            >
              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(capsule.capsule_id);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                {capsule.is_favorite ? '⭐' : '☆'}
              </button>

              {/* Date */}
              <div className="text-caption text-neutral-gray-medium mb-2">
                {new Date(capsule.created_date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              {/* Title */}
              <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-3 pr-8">
                {capsule.title}
              </h3>

              {/* Content Preview */}
              <p className="text-sm text-neutral-gray-medium line-clamp-3 mb-4">
                {capsule.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-medium">
                  {capsule.topic_category}
                </span>
                {capsule.emotion_tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      emotionColors[tag] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary-medium/5 rounded-card opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <img 
              src="/time-capsule.svg" 
              alt="타임캡슐" 
              className="w-24 h-24 mx-auto mb-4 opacity-50"
            />
            <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-2">
              아직 타임캡슐이 없습니다
            </h3>
            <p className="text-neutral-gray-medium mb-6">
              소중한 순간을 기록해보세요
            </p>
            <Link to="/timecapsule/create" className="btn-primary">
              첫 캡슐 만들기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
