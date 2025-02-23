# TiffinBox

<div align="center">

![TiffinBox Logo](https://github.com/user-attachments/assets/42c43108-02f8-4403-b41c-3a55325ecda9)

A modern graphical user interface for managing Distrobox containers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Tauri](https://img.shields.io/badge/Built%20with-Tauri-blue)](https://tauri.app)

</div>

## Overview

TiffinBox is a user-friendly desktop application that simplifies the management of Distrobox containers. Built with Tauri, it provides a Docker Desktop-like experience for managing Linux distribution containers, making it easier for users to work with multiple Linux environments without the complexity of command-line interfaces.

### What is Distrobox?

[Distrobox](https://github.com/89luca89/distrobox) is a powerful command-line tool that enables you to:
- Run any Linux distribution inside your terminal
- Maintain tight integration with the host system
- Share resources and folders seamlessly
- Avoid the overhead of traditional virtual machines

TiffinBox enhances Distrobox by providing a graphical interface for these capabilities, making container management accessible to users of all experience levels.

## Features

### Core Functionality
- Create and manage Distrobox containers through an intuitive interface
- Monitor container resource usage in real-time
- Configure container environment variables with ease
- Access containers through an integrated terminal emulator

### Advanced Features
- One-click container creation from popular Linux distributions
- Detailed container health monitoring and statistics
- Easy backup and restore functionality
- Seamless integration with host system resources

## Installation

### Prerequisites

Before installing TiffinBox, ensure you have the following dependencies:

1. **Rust and Cargo**
   - Follow the [official Rust installation guide](https://doc.rust-lang.org/cargo/getting-started/installation.html)

2. **Node.js**
   - Download from [nodejs.org](https://nodejs.org)
   - Recommended version: 16.x or higher

3. **Tauri Dependencies**
   - Follow the [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/#rust)
   - Required for building the application

### Build from Source

```bash
# Clone the repository
git clone https://github.com/BiscuitBobby/TiffinBox.git

# Navigate to project directory
cd TiffinBox

# Install dependencies
npm install

# Start development server
npm run tauri dev

# Build for production
npm run tauri build
```

## Usage

1. **Creating a Container**
   - Click the "New Container" button
   - Select your desired Linux distribution
   - Configure container settings
   - Click "Create"

2. **Managing Containers**
   - View all containers in the main dashboard
   - Monitor resource usage in real-time
   - Start, stop, or remove containers with a couple click

3. **Accessing Containers**
   - Use the built-in terminal for direct container access
   - Modify environment variables through the settings panel
   - Share files between host and container seamlessly

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## License

TiffinBox is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Report bugs through [GitHub Issues](https://github.com/BiscuitBobby/TiffinBox/issues)

---

<div align="center">
TiffinBox
</div>
