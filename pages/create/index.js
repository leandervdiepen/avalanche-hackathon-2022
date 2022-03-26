import { useState } from "react";

function create() {
  // form variables
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftImage, setNftImage] = useState(null);
  const [nftPrice, setNftPrice] = useState(0);
  const [nftOwner, setNftOwner] = useState("");
  const [nftMetadata, setNftMetadata] = useState("");

  // form validation
  const [nftNameValid, setNftNameValid] = useState(false);
  const [nftDescriptionValid, setNftDescriptionValid] = useState(false);
  const [nftImageValid, setNftImageValid] = useState(false);
  const [nftPriceValid, setNftPriceValid] = useState(false);
  const [nftOwnerValid, setNftOwnerValid] = useState(false);
  const [nftMetadataValid, setNftMetadataValid] = useState(false);

  let Form = () => {
    return (
      <div>
        <div className="flex flex-col">
          <label className="form-label inline-block mb-2 text-gray-700">
            NFT Name
          </label>
          <input
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            type="text"
            id="nftName"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            onBlur={() => {
              if (nftName.length > 0) {
                setNftNameValid(true);
              } else {
                setNftNameValid(false);
              }
            }}
          />
          {!nftNameValid && (
            <p className="text-red-500 text-xs italic">NFT Name is required</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="form-label inline-block mb-2 text-gray-700">
            NFT Description
          </label>
          <textarea
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            type="text"
            id="nftDescription"
            value={nftDescription}
            onChange={(e) => setNftDescription(e.target.value)}
            onBlur={() => {
              if (nftDescription.length > 0) {
                setNftDescriptionValid(true);
              } else {
                setNftDescriptionValid(false);
              }
            }}
          />
          {!nftDescriptionValid && (
            <p className="text-red-500 text-xs italic">
              NFT Description is required
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="form-label inline-block mb-2 text-gray-700">
            NFT Image
          </label>
          <input
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            type="file"
            id="nftImage"
            onChange={(e) => setNftImage(e.target.files[0])}
            onBlur={() => {
              if (nftImage) {
                setNftImageValid(true);
              } else {
                setNftImageValid(false);
              }
            }}
          />
          {!nftImageValid && (
            <p className="text-red-500 text-xs italic">NFT Image is required</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="form-label inline-block mb-2 text-gray-700">
            NFT Price
          </label>
          <input
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            type="number"
            id="nftPrice"
            value={nftPrice}
            onChange={(e) => setNftPrice(e.target.value)}
            onBlur={() => {
              if (nftPrice > 0) {
                setNftPriceValid(true);
              } else {
                setNftPriceValid(false);
              }
            }}
          />
          {!nftPriceValid && (
            <p className="text-red-500 text-xs italic">NFT Price is required</p>
          )}
        </div>
      </div>
    );
  };
}

export default create;
