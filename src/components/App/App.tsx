import { useState } from 'react';
import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import { fetchNotes } from '../../services/noteService';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';

function App() {
  // стани
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['notes', query, currentPage],
    queryFn: () => fetchNotes(query, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  const handleChangeQuery = useDebouncedCallback((query: string) => {
    setQuery(query);
    setCurrentPage(1);
  }, 500);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox inputValue={query} onChange={handleChangeQuery} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onSelectPage={setCurrentPage}
          />
        )}
        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>
      {isError && <div>Error. Try again.</div>}
      {isLoading && <div> Data is loading ...</div>}
      {isSuccess && data.notes.length === 0 && (
        <div>Data not found. Please try other query.</div>
      )}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} onSuccessAdd={setCurrentPage} />
        </Modal>
      )}
    </div>
  );
}

export default App;
