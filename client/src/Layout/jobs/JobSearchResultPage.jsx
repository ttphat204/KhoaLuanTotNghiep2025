import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from './JobCard';

const JOB_SEARCH_API = 'https://be-khoaluan.vercel.app/api/job/search';

const JobSearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) return;
    setLoading(true);
    fetch(`${JOB_SEARCH_API}?keyword=${encodeURIComponent(keyword.trim())}`)
      .then(res => res.json())
      .then(data => {
        setJobs(data.jobs || []);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [keyword]);

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          Kết quả tìm kiếm cho: <span className="text-black">"{keyword}"</span>
        </h2>
        {loading ? (
          <div className="text-center py-8">Đang tải kết quả...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Không tìm thấy công việc phù hợp.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job, idx) => (
              <JobCard key={job._id || idx} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearchResultPage; 