# tailportal

Create a Tailscale exit node with simple commands.

Bring your own key and pay your own bill, then let me do the rest.

## Installation

Install tailportal globally with npm:

```bash
npm install -g tailportal
```

## Usage

### Step 0: Install and setup pulumi CLI

link

### Step 1: Configuring your Tailnet

Add the following ACL changes:

```json
"tagOwners": {
  "tag:tailportal": ["autogroup:admin"],
},
"autoApprovers": {
	"exitNode": ["tag:tailportal"],
},
// Add ssh if you want to do more with the exit node
"ssh": [
  {
    "action": "accept",
    // !!IMPORTANT Change this
    "src":    ["username@GitHub"],
    "dst":    ["tag:tailportal"],
    "users":  ["autogroup:nonroot", "root"],
  },
]
```

2. Create tailscale authkey

<img src="./docs/images/ts-authkey.png" width="500" alt="TS AuthKey Image" />

### Step 2: Config Cloud Providers API

TBD: Vultr/Digital Ocean/AWS

### Step 3: Set environment variables

Create a `.env` file or set these environment variables:

```bash
VULTR_API_KEY=your_vultr_api_key
PULUMI_CONFIG_PASSPHRASE=your_pulumi_passphrase
TS_AUTH_KEY=your_tailscale_auth_key
```

### Step 4: Run

Once installed globally and environment variables are set:

```bash
tailportal --help
tailportal list
tailportal create vultr ewr
tailportal remove instance-name
tailportal destroy
```

#### For development (from source):

```bash
git clone https://github.com/Yukaii/tailportal
pnpm install

pnpm start
pnpm start list
pnpm start create
pnpm start remove instance-name
pnpm start destroy
```

## TODOs

- [ ] instance management: status, shutdown...
- [ ] simple TUI

## Appendix A: Startup times (for reference only)

| Provider | Startup time (seconds) |
| -------- | ---------------------- |
| vultr    | 70 secs                |
| gcp      | ~40 secs               |


<details>
<summary>CLI draft</summary>

## CLI draft

WIP WIP WIP

### General Options

- `-h, --help` : Show help and exit
- `-v, --version` : Show version and exit

### Commands

#### `up`

- Create and configure a new Tailportal instance
- Options:
  - `provider` : Specify the cloud provider (e.g. AWS, GCP, DigitalOcean)
  - `location` : Specify the location of the instance (e.g. us-west-2, europe-west1)
  - `authkey` : Specify the Tailscale AuthKey (optional, will prompt if not provided)

#### `down`

- Destroy the current Tailportal instance

#### `list`

- List all available instances

#### `status`

- Show the status of the current instance

#### `regions`

- List available regions for each provider
- Options:
  - `--provider` : Specify the cloud provider (e.g. AWS, GCP, DigitalOcean)
  - `--detail` : Show detailed information about each region (e.g. availability zones, instance types)

#### `providers`

- List available cloud providers
- Options:
  - `--detail` : Show detailed information about each provider (e.g. supported regions, instance types)

### Example Usage

- `tailportal up --provider=aws --location=us-west-2` : Create a new instance on AWS in us-west-2
- `tailportal down` : Destroy the current instance
- `tailportal list` : List all available instances
- `tailportal status` : Show the status of the current instance
- `tailportal regions` : List available regions for all providers
- `tailportal regions --provider=aws` : List available regions for AWS
- `tailportal regions --provider=aws --detail` : Show detailed information about each AWS region
- `tailportal providers` : List available cloud providers
- `tailportal providers --detail` : Show detailed information about each provider (e.g. supported regions, instance types)

</details>

## License

MIT
