import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const DecryptionGrid = ({ committeeSize, partialDecryptions }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDecryption, setSelectedDecryption] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const gridSize = Math.ceil(Math.sqrt(committeeSize || 0));
  const cells = Array.from({ length: gridSize * gridSize }, (_, i) => i);

  const openModal = (index) => {
    setSelectedDecryption(partialDecryptions?.[index]);
    setSelectedIndex(index);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDecryption(null);
    setSelectedIndex(null);
  };

  useEffect(() => {
    Modal.setAppElement('body');
  }, []);

  if (!committeeSize) {
    return <div>Loading committee information...</div>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-inner h-full">
      <div 
        className="grid gap-1 border-2 border-gray-300 p-2 rounded-md h-full"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridAutoRows: '1fr',
        }}
      >
        {cells.map((index) => (
          <div
            key={index}
            className={`
              rounded-sm cursor-pointer transition-colors duration-200 
              flex items-center justify-center text-xs
              ${partialDecryptions?.[index] ? 'bg-blue-500 hover:bg-blue-600 shadow-md' : 'bg-gray-200 hover:bg-gray-300'}
            `}
            style={{
              aspectRatio: '1 / 1',
            }}
            onClick={() => openModal(index)}
          />
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Partial Decryption Info"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <h2 className="text-xl font-bold mb-4">Partial Decryption Info</h2>
        {selectedIndex !== null && (
          <>
            <p className="mb-2"><strong>Signer Index:</strong> {selectedIndex + 1}</p>
            {selectedIndex > committeeSize - 2 ? (
              <p>No signer data available. The committee size is {committeeSize}, and this index exceeds the maximum valid index.</p>
            ) : selectedDecryption ? (
              <div className="p-4 rounded overflow-hidden" style={{ backgroundColor: '#EAEAEA' }}>
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(selectedDecryption, null, 2)}
                </pre>
              </div>
            ) : (
              <p>No decryption data available for this cell.</p>
            )}
          </>
        )}
        <button 
          onClick={closeModal}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default DecryptionGrid;