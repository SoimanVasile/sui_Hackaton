import React from 'react';

// Define the component for creating an NFT
const CreatePage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for your Sui interaction/minting logic
    alert("NFT Creation form submitted! Ready to mint.");
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Mint a New NFT on Sui</h1>
      <p>Use this page to upload assets and mint a new NFT on the Sui blockchain.</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="nftName" style={{ display: 'block', fontWeight: 'bold' }}>NFT Name:</label>
          <input 
            id="nftName" 
            type="text" 
            required 
            placeholder="e.g., My Awesome Collectible"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }} 
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', fontWeight: 'bold' }}>Description:</label>
          <textarea 
            id="description" 
            required 
            placeholder="A short description of your NFT."
            rows={4}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }} 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="imageUrl" style={{ display: 'block', fontWeight: 'bold' }}>Image URL / File Upload:</label>
          <input 
            id="imageUrl" 
            type="text" // Or change to type="file" for real upload
            required 
            placeholder="Enter a link to your asset or select a file"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }} 
          />
        </div>
        
        <button 
          type="submit" 
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Create and Mint
        </button>
      </form>
    </div>
  );
};

export default CreatePage;