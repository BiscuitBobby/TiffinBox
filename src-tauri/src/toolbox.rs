use serde_json::{json, Value};

pub fn get_toolbox_json() -> Value {
    json!({
      "Toolboxes": {
        "AlmaLinux": {
          "images": [
            "quay.io/toolbx-images/almalinux-toolbox:8",
            "quay.io/toolbx-images/almalinux-toolbox:9",
            "quay.io/toolbx-images/almalinux-toolbox:latest"
          ]
        },
        "Alpine": {
          "images": [
            "quay.io/toolbx-images/alpine-toolbox:3.16",
            "quay.io/toolbx-images/alpine-toolbox:3.17",
            "quay.io/toolbx-images/alpine-toolbox:3.18",
            "quay.io/toolbx-images/alpine-toolbox:3.19",
            "quay.io/toolbx-images/alpine-toolbox:3.20",
            "quay.io/toolbx-images/alpine-toolbox:edge",
            "quay.io/toolbx-images/alpine-toolbox:latest"
          ]
        },
        "AmazonLinux": {
          "images": [
            "quay.io/toolbx-images/amazonlinux-toolbox:2",
            "quay.io/toolbx-images/amazonlinux-toolbox:2023",
            "quay.io/toolbx-images/amazonlinux-toolbox:latest"
          ]
        },
        "Archlinux": {
          "images": ["quay.io/toolbx/arch-toolbox:latest"]
        },
        "Bazzite Arch": {
          "images": [
            "ghcr.io/ublue-os/bazzite-arch:latest",
            "ghcr.io/ublue-os/bazzite-arch-gnome:latest"
          ]
        },
        "Centos": {
          "images": [
            "quay.io/toolbx-images/centos-toolbox:stream8",
            "quay.io/toolbx-images/centos-toolbox:stream9",
            "quay.io/toolbx-images/centos-toolbox:latest"
          ]
        },
        "Debian": {
          "images": [
            "quay.io/toolbx-images/debian-toolbox:10",
            "quay.io/toolbx-images/debian-toolbox:11",
            "quay.io/toolbx-images/debian-toolbox:12",
            "quay.io/toolbx-images/debian-toolbox:testing",
            "quay.io/toolbx-images/debian-toolbox:unstable",
            "quay.io/toolbx-images/debian-toolbox:latest"
          ]
        },
        "Fedora": {
          "images": [
            "registry.fedoraproject.org/fedora-toolbox:37",
            "registry.fedoraproject.org/fedora-toolbox:38",
            "registry.fedoraproject.org/fedora-toolbox:39",
            "registry.fedoraproject.org/fedora-toolbox:40",
            "quay.io/fedora/fedora-toolbox:41",
            "quay.io/fedora/fedora-toolbox:rawhide"
          ]
        },
        "openSUSE": {
          "images": ["registry.opensuse.org/opensuse/distrobox:latest"]
        },
        "RedHat": {
          "images": [
            "registry.access.redhat.com/ubi8/toolbox",
            "registry.access.redhat.com/ubi9/toolbox"
          ]
        },
        "Rocky Linux": {
          "images": [
            "quay.io/toolbx-images/rockylinux-toolbox:8",
            "quay.io/toolbx-images/rockylinux-toolbox:9",
            "quay.io/toolbx-images/rockylinux-toolbox:latest"
          ]
        },
        "Ubuntu": {
          "images": [
            "quay.io/toolbx/ubuntu-toolbox:16.04",
            "quay.io/toolbx/ubuntu-toolbox:18.04",
            "quay.io/toolbx/ubuntu-toolbox:20.04",
            "quay.io/toolbx/ubuntu-toolbox:22.04",
            "quay.io/toolbx/ubuntu-toolbox:24.04",
            "quay.io/toolbx/ubuntu-toolbox:latest"
          ]
        },
        "Chainguard Wolfi": {
          "images": ["quay.io/toolbx-images/wolfi-toolbox:latest"]
        },
        "Ublue": {
          "images": [
            "ghcr.io/ublue-os/bluefin-cli",
            "ghcr.io/ublue-os/ubuntu-toolbox",
            "ghcr.io/ublue-os/fedora-toolbox",
            "ghcr.io/ublue-os/wolfi-toolbox",
            "ghcr.io/ublue-os/arch-distrobox",
            "ghcr.io/ublue-os/powershell-toolbox"
          ]
        }
      },
      "Base_Images": {
        "AlmaLinux": {
          "images": [
            "docker.io/library/almalinux:8",
            "docker.io/library/almalinux:9"
          ]
        },
        "Alpine Linux": {
          "images": [
            "docker.io/library/alpine:3.15",
            "docker.io/library/alpine:3.16",
            "docker.io/library/alpine:3.17",
            "docker.io/library/alpine:3.18",
            "docker.io/library/alpine:3.19",
            "docker.io/library/alpine:3.20",
            "docker.io/library/alpine:edge",
            "docker.io/library/alpine:latest"
          ]
        },
        "AmazonLinux": {
          "images": [
            "public.ecr.aws/amazonlinux/amazonlinux:1",
            "public.ecr.aws/amazonlinux/amazonlinux:2",
            "public.ecr.aws/amazonlinux/amazonlinux:2023"
          ]
        },
        "Archlinux": {
          "images": ["docker.io/library/archlinux:latest"]
        },
        "Blackarch": {
          "images": ["docker.io/blackarchlinux/blackarch:latest"]
        },
        "CentOS Stream": {
          "images": [
            "quay.io/centos/centos:stream8",
            "quay.io/centos/centos:stream9"
          ]
        },
        "Debian": {
          "images": [
            "docker.io/debian/eol:wheezy",
            "docker.io/library/debian:buster",
            "docker.io/library/debian:bullseye-backports",
            "docker.io/library/debian:bookworm-backports",
            "docker.io/library/debian:stable-backports"
          ]
        },
        "Debian Testing": {
          "images": [
            "docker.io/library/debian:testing",
            "docker.io/library/debian:testing-backports"
          ]
        },
        "Debian Unstable": {
          "images": ["docker.io/library/debian:unstable"]
        },
        "Ubuntu": {
          "images": [
            "docker.io/library/ubuntu:14.04",
            "docker.io/library/ubuntu:16.04",
            "docker.io/library/ubuntu:18.04",
            "docker.io/library/ubuntu:20.04",
            "docker.io/library/ubuntu:22.04",
            "docker.io/library/ubuntu:24.04"
          ]
        }
      }
    }
    )
}
