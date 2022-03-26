const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OmniChainToken", function () {
    beforeEach(async function () {
        this.accounts = await ethers.getSigners();
        this.owner = this.accounts[0];

        // use this chainId
        this.chainId = 123;

        // create a LayerZero Endpoint mock for testing
        const LZEndpointMock = await ethers.getContractFactory("LZEndpointMock");
        this.lzEndpointMock = await LZEndpointMock.deploy(this.chainId);

        // create two OmniChainToken instances
        const OmniChainToken = await ethers.getContractFactory("NFT");
        this.omniChainTokenA = await OmniChainToken.deploy("NAME1", "SYM1", this.lzEndpointMock.address);
        this.omniChainTokenB = await OmniChainToken.deploy("NAME2", "SYM2", this.lzEndpointMock.address);

        this.lzEndpointMock.setDestLzEndpoint(this.omniChainTokenA.address, this.lzEndpointMock.address)
        this.lzEndpointMock.setDestLzEndpoint(this.omniChainTokenB.address, this.lzEndpointMock.address)

        // set each contracts remote address so it can send to each other
        await this.omniChainTokenA.setRemote(this.chainId, this.omniChainTokenB.address) // for A, set B
        await this.omniChainTokenB.setRemote(this.chainId, this.omniChainTokenA.address) // for B, set A

        // retrieve the starting tokens
        this.startingTokens = await this.omniChainTokenA.balanceOf(this.owner.address);
    });

    it("burn local tokens on chain a and mint on chain b", async function () {
        // ensure they're both starting from 100000000000000000000
        let a = await this.omniChainTokenA.balanceOf(this.owner.address);
        let b = await this.omniChainTokenB.balanceOf(this.owner.address);
        expect(a).to.be.equal(this.startingTokens);
        expect(b).to.be.equal(this.startingTokens);
        console.log(a.toString());
        console.log(b.toString());

        //approve and send tokens
        //let sendQty = ethers.utils.parseUnits("100", 18)
        await this.omniChainTokenA.createToken("https://gateway.pinata.cloud/ipfs/QmZXsHdE13ruPqz3myrrSdnUZuMYtWmWr4DmRkuCT9jLAQ/");
        let sendQty = 1;
        await this.omniChainTokenA.approve(this.omniChainTokenA.address, sendQty);
        await this.omniChainTokenA.approve(this.omniChainTokenB.address, sendQty);
        const ownerBefore = await this.omniChainTokenA.ownerOf(sendQty);
        console.log("ownerBefore",ownerBefore.toString());
        console.log("ownerBefore");
        await this.omniChainTokenA.sendTokens(this.chainId, this.omniChainTokenB.address, sendQty)

        const own = await this.omniChainTokenB.ownerOf(sendQty);
        console.log(this.omniChainTokenA.address);
        console.log(this.omniChainTokenB.address);
        console.log(this.accounts[0].address);
        console.log(own.toString());

        //verify tokens burned on chain a and minted on chain b
        a = await this.omniChainTokenA.balanceOf(this.owner.address);
        b = await this.omniChainTokenB.balanceOf(this.owner.address);
        console.log(a.toString());
        console.log(b.toString());
        expect(a).to.be.equal(0);
        expect(b).to.be.equal(1);

        this.accounts[0].approve(this.omniChainTokenB.address,sendQty);
        this.accounts[0].approve(this.omniChainTokenA.address,sendQty);
        await this.omniChainTokenB.approve(this.omniChainTokenB.address, sendQty);
        await this.omniChainTokenB.approve(this.omniChainTokenA.address, sendQty);
        await this.omniChainTokenB.sendTokens(this.chainId, this.omniChainTokenA.address, sendQty)
        console.log(a);
        console.log(b);
        expect(a).to.be.equal(1);
        expect(b).to.be.equal(0);
    });
});


