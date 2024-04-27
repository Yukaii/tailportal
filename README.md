# tailportal

Create a Tailscale exit node with simple commands.

Bring your own key and pay your own bill, then let it do the rest.

## Usage

### Step 1: Configuring your Tailnet

Add the following ACL changes:

```json
"tagOwners": {
  "tag:tailportal": ["autogroup:admin"],
},
"ssh": [
  // Allow all users to SSH into their own devices in check mode.
  // Comment this section out if you want to define specific restrictions.
  {
    "action": "check",
    "src":    ["autogroup:member"],
    "dst":    ["autogroup:self"],
    "users":  ["autogroup:nonroot", "root"],
  },
  {
    "action": "accept",
    // !!IMPORTANT Change this
    "src":    ["autogroup:member"],
    "dst":    ["tag:tailportal"],
    "users":  ["autogroup:nonroot", "root"],
  },
],
"autoApprovers": {
	"exitNode": ["tag:tailportal"],
},
```

2. Create tailscale authkey

<img src="./docs/images/ts-authkey.png" width="500" alt="TS AuthKey Image" />

### Step 2: Config Cloud Providers API

TBD: Vultr/Digital Ocean/AWS

## TODOs

- [ ] instance management: status, shutdown...
- [ ] simple TUI

## CLI draft

WIP WIP WIP

### General Options

* `-h, --help` : Show help and exit
* `-v, --version` : Show version and exit

### Commands

#### `up`

* Create and configure a new Tailportal instance
* Options:
	+ `provider` : Specify the cloud provider (e.g. AWS, GCP, DigitalOcean)
	+ `location` : Specify the location of the instance (e.g. us-west-2, europe-west1)
	+ `authkey` : Specify the Tailscale AuthKey (optional, will prompt if not provided)

#### `down`

* Destroy the current Tailportal instance

#### `list`

* List all available instances

#### `status`

* Show the status of the current instance

#### `regions`

* List available regions for each provider
* Options:
	+ `--provider` : Specify the cloud provider (e.g. AWS, GCP, DigitalOcean)
	+ `--detail` : Show detailed information about each region (e.g. availability zones, instance types)

#### `providers`

* List available cloud providers
* Options:
	+ `--detail` : Show detailed information about each provider (e.g. supported regions, instance types)

### Example Usage

* `tailportal up --provider=aws --location=us-west-2` : Create a new instance on AWS in us-west-2
* `tailportal down` : Destroy the current instance
* `tailportal list` : List all available instances
* `tailportal status` : Show the status of the current instance
* `tailportal regions` : List available regions for all providers
* `tailportal regions --provider=aws` : List available regions for AWS
* `tailportal regions --provider=aws --detail` : Show detailed information about each AWS region
* `tailportal providers` : List available cloud providers
* `tailportal providers --detail` : Show detailed information about each provider (e.g. supported regions, instance types)


## License

MIT
