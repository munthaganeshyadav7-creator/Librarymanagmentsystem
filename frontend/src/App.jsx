import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CatalogPage } from './pages/CatalogPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BorrowHistoryPage } from './pages/BorrowHistoryPage';
import { AuthPage } from './pages/AuthPage';
import { BorrowModal } from './components/BorrowModal';
import { ReturnModal } from './components/ReturnModal';
import { BookFormModal } from './components/BookFormModal';
import { Toast } from './components/Toast';

function MainApp() {
  const { user, isAuthenticated, canManage } = useAuth();
  const [activePage, setActivePage] = useState('catalog'); // 'catalog', 'student-dashboard', 'admin-dashboard', 'history', 'auth'
  
  // Modals state
  const [borrowModalBook, setBorrowModalBook] = useState(null);
  const [returnModalBorrow, setReturnModalBorrow] = useState(null);
  const [bookFormModal, setBookFormModal] = useState({ isOpen: false, book: null });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleDataMutationSuccess = (message) => {
    showToast(message, 'success');
    setRefreshCounter(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main Pages */}
      <main className="flex-1">
        {activePage === 'catalog' && (
          <CatalogPage
            triggerRefresh={refreshCounter}
            onBorrowClick={(book) => {
              if (!isAuthenticated) {
                setAuthModalOpen(true);
              } else {
                setBorrowModalBook(book);
              }
            }}
            onEditClick={(book) => {
              setBookFormModal({ isOpen: true, book });
            }}
          />
        )}

        {activePage === 'student-dashboard' && (
          <StudentDashboardPage
            triggerRefresh={refreshCounter}
            onReturnClick={(borrow) => setReturnModalBorrow(borrow)}
            onNavigateCatalog={() => setActivePage('catalog')}
          />
        )}

        {activePage === 'admin-dashboard' && (
          <AdminDashboardPage
            triggerRefresh={refreshCounter}
            onAddBookClick={() => setBookFormModal({ isOpen: true, book: null })}
            onEditBookClick={(book) => setBookFormModal({ isOpen: true, book })}
            onReturnClick={(borrow) => setReturnModalBorrow(borrow)}
          />
        )}

        {activePage === 'history' && (
          <BorrowHistoryPage
            triggerRefresh={refreshCounter}
            onReturnClick={(borrow) => setReturnModalBorrow(borrow)}
          />
        )}

        {activePage === 'auth' && (
          <AuthPage
            onSuccess={(msg) => {
              showToast(msg, 'success');
              setActivePage('catalog');
            }}
          />
        )}
      </main>

      {/* Modals */}
      <BorrowModal
        book={borrowModalBook}
        isOpen={Boolean(borrowModalBook)}
        onClose={() => setBorrowModalBook(null)}
        onSuccess={(msg) => handleDataMutationSuccess(msg)}
      />

      <ReturnModal
        borrow={returnModalBorrow}
        isOpen={Boolean(returnModalBorrow)}
        onClose={() => setReturnModalBorrow(null)}
        onSuccess={(msg) => handleDataMutationSuccess(msg)}
      />

      <BookFormModal
        isOpen={bookFormModal.isOpen}
        bookToEdit={bookFormModal.book}
        onClose={() => setBookFormModal({ isOpen: false, book: null })}
        onSuccess={(msg) => handleDataMutationSuccess(msg)}
      />

      {authModalOpen && (
        <AuthPage
          isOpenModal={true}
          onCloseModal={() => setAuthModalOpen(false)}
          onSuccess={(msg) => {
            showToast(msg, 'success');
            setAuthModalOpen(false);
          }}
        />
      )}

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
