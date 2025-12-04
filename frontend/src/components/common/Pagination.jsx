import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, recordsNameKey = 'records' }) => {
  const { t } = useTranslation();

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <span className="text-sm text-gray-500">
        {t('pagination.showingPage', { currentPage, totalPages, recordsName: t(recordsNameKey) })}
      </span>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="p-2 rounded-md disabled:opacity-50 transition-colors duration-200 hover:bg-gray-200"
        >
          <ChevronLeft size={20} />
        </button>
        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                currentPage === page ? 'bg-brand-primary text-white' : 'hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-4 py-2 text-sm">
              {page}
            </span>
          )
        )}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md disabled:opacity-50 transition-colors duration-200 hover:bg-gray-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;