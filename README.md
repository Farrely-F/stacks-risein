# 🚀 Stacks Learning Journey

Welcome to my learning journey repo for the **Stacks Developer Bootcamp**! In this bootcamp, I explored how to build **smart contracts** and **decentralized applications (dApps)** on top of **Bitcoin** using **Stacks**, a powerful Layer 2 solution that leverages Bitcoin’s security and finality while enabling smart contract functionality.

This repository documents everything I learned during the 2-day bootcamp, including **hands-on projects**, **smart contract coding**, and **real-world dApp creation**.

## 📚 Table of Contents

1. [About the Bootcamp](#about-the-bootcamp)
2. [Day 1: Foundation & Tic Tac Toe Setup](#day-1-foundation--tic-tac-toe-setup)
   - 🔑 Blockchain & Bitcoin Fundamentals
   - 🛠️ Stacks Introduction
   - 🖥️ Bitcoin Explorer Hands-on
   - ⚙️ Development Environment Setup
   - 💳 Leather Wallet Setup
   - 🎮 Tic Tac Toe Project Foundation
3. [Day 2: Individual Project Development](#day-2-individual-project-development)
   - 🧑‍💻 Project Selection & Planning
   - 🧩 Project Options (Tic Tac Toe, Token Management, NFT, Voting/DAO)
   - 🛠️ Project Implementation & Presentation
4. [Project Files](#project-files)
5. [Final Project](#final-project)
6. [Links & Resources](#links--resources)

## 📌 About the Bootcamp

The **Stacks Developer Bootcamp** is a 2-day immersive event designed to teach developers how to build dApps and smart contracts on top of Bitcoin using Stacks. Hosted by **Rise In X BlockDevId**, this bootcamp focuses on **blockchain fundamentals**, **development tools**, and creating practical blockchain solutions.

- **Location**: Jakarta, Indonesia 🇮🇩
- **Date**: [Insert Date Here] 🗓️
- **Powered by**: Stacks & Rise In X BlockDevId ⚡

## 📅 Day 1: Foundation & Tic Tac Toe Setup

### 🕐 Session 1 (10:00-12:00): Pengenalan

- **🔑 Blockchain & Bitcoin Fundamentals**  
  Dive into the basics of Bitcoin and its limitations.
- **🛠️ Stacks Introduction**  
  Learn how Stacks enhances Bitcoin with **Proof of Transfer** and smart contract support.
- **🖥️ Bitcoin Explorer**  
  Hands-on exploration of the Bitcoin network for better understanding.

### 🕑 Session 2 (13:30-16:00): Project Setup

- **⚙️ Development Environment**  
  Set up Clarinet, VS Code, and configure Leather wallet for testnet development.
- **🎮 Tic Tac Toe Project Foundation**  
  Initialize the project, structure basic smart contracts, and start building!
- **🧪 Interactive Console Testing**  
  Test the contract interactively using **Clarinet**.

## 📅 Day 2: Individual Project Development

### 🕐 Session 3 (10:00-12:00): Project Selection & Planning

- **🔄 Review Day 1**  
  A quick review of the Tic Tac Toe project foundation.
- **🧑‍💻 Individual Project Options**  
  Choose your learning path and get creative:
  - 🎮 **Option 1: Complete Tic Tac Toe Game**
    - Implement all game functions (create, join, play)
    - Add a **betting mechanism** using STX
    - Implement **win conditions** and **game state management**
  - 🪙 **Option 2: Token Management System**
    - Create a **fungible token** with minting & burning functionality
    - Implement **transfer restrictions** and **basic staking**
  - 🖼️ **Option 3: Simple NFT Collection**
    - Build a basic **NFT contract** with minting functions
    - Manage **metadata** and implement simple marketplace functions
  - 🗳️ **Option 4: Voting/DAO System**
    - Create a **proposal system** with voting mechanisms
    - Implement **delegated voting** and basic **governance features**

### 🕑 Session 4 (13:30-16:00): Implementation & Presentation

- **🛠️ Individual Coding Session**  
  Work on your project with 1-on-1 mentoring and hands-on coding.
- **📝 Testing & Documentation**  
  Test your project and write up comprehensive documentation.
- **🔧 Optional Enhancements**  
  Add **frontend integration** or deploy your project on the **testnet**.
- **🎤 Project Presentations**  
  Present your project to the group (2-3 minutes each) and explain your approach.

## 🗂️ Project Files

This folder contains all the work from the bootcamp:

- **Project 1: Tic Tac Toe Game**
  - Smart contract logic for the Tic Tac Toe game, including **player creation**, **gameplay mechanics**, and **state management**.
- **Project 2: [Choose Project Option]**
  - The project you chose to work on with all relevant smart contracts and enhancements.

## 🎉 Final Project

### Stacks Auction

Traditional auction platforms suffer from centralized control, high fees, lack of transparency, geographic limitations, and trust issues. These platforms create barriers for both buyers and sellers while extracting significant value from transactions. There is a critical need for a decentralized auction platform that leverages blockchain technology to create a transparent, trustless, and globally accessible marketplace.

#### Contract Overview

- **Auction Contract**: Manages the creation, bidding, and ending of auctions.
- **Token Contract**: Handles the creation and transfer of auction tokens (e.g., STX).
- **Marketplace Contract**: Facilitates the listing, buying, and selling of items on the auction platform.

```yaml
id: 0
name: Testnet deployment
network: testnet
stacks-node: "https://api.testnet.hiro.so"
bitcoin-node: "http://blockstack:blockstacksystem@bitcoind.testnet.stacks.co:18332"
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: stacks-auction-v2
            expected-sender: ST214GJ5G2K6ZHF3BWF2P4ZPA9CBJVGMBAPP6RW6X
            cost: 129570
            path: contracts/stacks-auction-v2.clar
            anchor-block-only: true
            clarity-version: 3
      epoch: "3.2"
      network: testnet
```

## 🔗 Links & Resources

- **Stacks Documentation**: [https://www.stacks.co/](https://www.stacks.co/)
- **Clarinet (Stacks Development Tool)**: [https://github.com/hiRoFaX/clarinet](https://github.com/hiRoFaX/clarinet)
- **Bitcoin Explorer**: [https://www.blockchain.com/explorer](https://www.blockchain.com/explorer)
- **Rise In X BlockDevId**: [https://www.riseinblockdevid.com/](https://www.riseinblockdevid.com/)
