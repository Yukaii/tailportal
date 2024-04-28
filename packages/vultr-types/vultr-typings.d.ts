export type OS =
  | {
      id: 159;
      name: "Custom";
      arch: "x64";
      family: "iso";
    }
  | {
      id: 164;
      name: "Snapshot";
      arch: "x64";
      family: "snapshot";
    }
  | {
      id: 167;
      name: "CentOS 7 x64";
      arch: "x64";
      family: "centos";
    }
  | {
      id: 180;
      name: "Backup";
      arch: "x64";
      family: "backup";
    }
  | {
      id: 186;
      name: "Application";
      arch: "x64";
      family: "application";
    }
  | {
      id: 240;
      name: "Windows 2016 Standard x64";
      arch: "x64";
      family: "windows";
    }
  | {
      id: 352;
      name: "Debian 10 x64 (buster)";
      arch: "x64";
      family: "debian";
    }
  | {
      id: 371;
      name: "Windows 2019 Standard x64";
      arch: "x64";
      family: "windows";
    }
  | {
      id: 381;
      name: "CentOS 7 SELinux x64";
      arch: "x64";
      family: "centos";
    }
  | {
      id: 387;
      name: "Ubuntu 20.04 LTS x64";
      arch: "x64";
      family: "ubuntu";
    }
  | {
      id: 391;
      name: "Fedora CoreOS Stable";
      arch: "x64";
      family: "fedora-coreos";
    }
  | {
      id: 401;
      name: "CentOS 8 Stream x64";
      arch: "x64";
      family: "centos";
    }
  | {
      id: 424;
      name: "Fedora CoreOS Next";
      arch: "x64";
      family: "fedora-coreos";
    }
  | {
      id: 425;
      name: "Fedora CoreOS Testing";
      arch: "x64";
      family: "fedora-coreos";
    }
  | {
      id: 447;
      name: "FreeBSD 13 x64";
      arch: "x64";
      family: "freebsd";
    }
  | {
      id: 448;
      name: "Rocky Linux x64";
      arch: "x64";
      family: "rockylinux";
    }
  | {
      id: 452;
      name: "AlmaLinux x64";
      arch: "x64";
      family: "almalinux";
    }
  | {
      id: 477;
      name: "Debian 11 x64 (bullseye)";
      arch: "x64";
      family: "debian";
    }
  | {
      id: 501;
      name: "Windows 2022 Standard x64";
      arch: "x64";
      family: "windows";
    }
  | {
      id: 521;
      name: "Windows Core 2022 Standard x64";
      arch: "x64";
      family: "windows";
    }
  | {
      id: 522;
      name: "Windows Core 2016 Standard x64";
      arch: "x64";
      family: "windows";
    }
  | {
      id: 523;
      name: "Windows Core 2019 Standard x64";
      arch: "x64";
      family: "windows";
    }
  | {
      id: 535;
      name: "Arch Linux x64";
      arch: "x64";
      family: "archlinux";
    }
  | {
      id: 542;
      name: "CentOS 9 Stream x64";
      arch: "x64";
      family: "centos";
    }
  | {
      id: 1743;
      name: "Ubuntu 22.04 LTS x64";
      arch: "x64";
      family: "ubuntu";
    }
  | {
      id: 1761;
      name: "Windows Core 2019 Datacenter x64";
      arch: "x64";
      family: "windows";
    }
  | {
      id: 1762;
      name: "Windows Core 2022 Datacenter x64";
      arch: "x64";
      family: "windows";
    }
  | {
      id: 1764;
      name: "Windows 2019 Datacenter x64";
      arch: "x64";
      family: "windows";
    }
  | {
      id: 1765;
      name: "Windows 2022 Datacenter x64";
      arch: "x64";
      family: "windows";
    }
  | {
      id: 1868;
      name: "AlmaLinux 9 x64";
      arch: "x64";
      family: "almalinux";
    }
  | {
      id: 1869;
      name: "Rocky Linux 9 x64";
      arch: "x64";
      family: "rockylinux";
    }
  | {
      id: 2075;
      name: "Flatcar Container Linux LTS x64";
      arch: "x64";
      family: "flatcar";
    }
  | {
      id: 2076;
      name: "Alpine Linux x64";
      arch: "x64";
      family: "alpinelinux";
    }
  | {
      id: 2077;
      name: "Flatcar Container Linux Stable x64";
      arch: "x64";
      family: "flatcar";
    }
  | {
      id: 2078;
      name: "Flatcar Container Linux Beta x64";
      arch: "x64";
      family: "flatcar";
    }
  | {
      id: 2079;
      name: "Flatcar Container Linux Alpha x64";
      arch: "x64";
      family: "flatcar";
    }
  | {
      id: 2107;
      name: "Fedora 38 x64";
      arch: "x64";
      family: "fedora";
    }
  | {
      id: 2136;
      name: "Debian 12 x64 (bookworm)";
      arch: "x64";
      family: "debian";
    }
  | {
      id: 2157;
      name: "openSUSE Leap 15 x64";
      arch: "x64";
      family: "opensuse";
    }
  | {
      id: 2179;
      name: "Ubuntu 23.10 x64";
      arch: "x64";
      family: "ubuntu";
    }
  | {
      id: 2180;
      name: "Fedora 39 x64";
      arch: "x64";
      family: "fedora";
    }
  | {
      id: 2187;
      name: "OpenBSD 7.4 x64";
      arch: "x64";
      family: "openbsd";
    }
  | {
      id: 2212;
      name: "FreeBSD 14 x64";
      arch: "x64";
      family: "freebsd";
    }
  | {
      id: 2256;
      name: "Vultr GPU Cluster Stack Ubuntu 20.04";
      arch: "x64";
      family: "vultr_gpu_cluster_stack";
    }
  | {
      id: 2283;
      name: "Fedora 40 x64";
      arch: "x64";
      family: "fedora";
    }
  | {
      id: 2284;
      name: "Ubuntu 24.04 LTS x64";
      arch: "x64";
      family: "ubuntu";
    }
  | {
      id: 2286;
      name: "OpenBSD 7.5 x64";
      arch: "x64";
      family: "openbsd";
    };

export type Region =
  | {
      id: "ams";
      city: "Amsterdam";
      country: "NL";
      continent: "Europe";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "block_storage_high_perf",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "atl";
      city: "Atlanta";
      country: "US";
      continent: "North America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "blr";
      city: "Bangalore";
      country: "IN";
      continent: "Asia";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "block_storage_high_perf",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "bom";
      city: "Mumbai";
      country: "IN";
      continent: "Asia";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "cdg";
      city: "Paris";
      country: "FR";
      continent: "Europe";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "del";
      city: "Delhi NCR";
      country: "IN";
      continent: "Asia";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "dfw";
      city: "Dallas";
      country: "US";
      continent: "North America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "ewr";
      city: "New Jersey";
      country: "US";
      continent: "North America";
      options: [
        "ddos_protection",
        "block_storage_high_perf",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "fra";
      city: "Frankfurt";
      country: "DE";
      continent: "Europe";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "hnl";
      city: "Honolulu";
      country: "US";
      continent: "North America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "icn";
      city: "Seoul";
      country: "KR";
      continent: "Asia";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "itm";
      city: "Osaka";
      country: "JP";
      continent: "Asia";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "jnb";
      city: "Johannesburg";
      country: "ZA";
      continent: "Africa";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "lax";
      city: "Los Angeles";
      country: "US";
      continent: "North America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "block_storage_high_perf",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "lhr";
      city: "London";
      country: "GB";
      continent: "Europe";
      options: [
        "ddos_protection",
        "block_storage_high_perf",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "mad";
      city: "Madrid";
      country: "ES";
      continent: "Europe";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "man";
      city: "Manchester";
      country: "GB";
      continent: "Europe";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "mel";
      city: "Melbourne";
      country: "AU";
      continent: "Australia";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "mex";
      city: "Mexico City";
      country: "MX";
      continent: "North America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "mia";
      city: "Miami";
      country: "US";
      continent: "North America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "nrt";
      city: "Tokyo";
      country: "JP";
      continent: "Asia";
      options: [
        "ddos_protection",
        "block_storage_high_perf",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "ord";
      city: "Chicago";
      country: "US";
      continent: "North America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "sao";
      city: "São Paulo";
      country: "BR";
      continent: "South America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "scl";
      city: "Santiago";
      country: "CL";
      continent: "South America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "sea";
      city: "Seattle";
      country: "US";
      continent: "North America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "sgp";
      city: "Singapore";
      country: "SG";
      continent: "Asia";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "block_storage_high_perf",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "sjc";
      city: "Silicon Valley";
      country: "US";
      continent: "North America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "sto";
      city: "Stockholm";
      country: "SE";
      continent: "Europe";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "syd";
      city: "Sydney";
      country: "AU";
      continent: "Australia";
      options: [
        "ddos_protection",
        "block_storage_high_perf",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "tlv";
      city: "Tel Aviv";
      country: "IL";
      continent: "Asia";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "waw";
      city: "Warsaw";
      country: "PL";
      continent: "Europe";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    }
  | {
      id: "yto";
      city: "Toronto";
      country: "CA";
      continent: "North America";
      options: [
        "ddos_protection",
        "block_storage_storage_opt",
        "load_balancers",
        "kubernetes",
      ];
    };
