# Subcli
Component Generation Tool for FRAME Pallets in the Substrate Framework.
Cli tool helps automatically generate code, no need to do manual work anymore, just focus on building functions

## Commands

```bash
subcli -h
Create a new Substrate Node Template project.


Options:
new                 Create a new Substrate Node Template project.

storage value       Create a new storage value
storage map         Create a new storage map


struct              Create a new struct
extrisic            Create a new extrinsic
```

## Install

```bash
cargo install subcli --force
```



## Create new project
```bash
subcli new <project-name> [Options]
Create a new Substrate Node Template project.

Arguments:
<project-name>   Name of project

Options:
-d, --directory     Path of folder contains project. Default is current directory.
-h, --help          Print help
```

## Create a new storage
### Create a new storage value 

```bash
subcli storage value <storage-name> <storage-type> [OPTIONS]
Create a new storage value

Arguments:
<storage-name>      Name of project
<storage-type>      type of storage.
                        Ex: u8, u32,... or struct


Options:
-m, --method        Generate methods for storage. 
                    c -> create
                    u -> update
                    d -> delete
                    Example: -m cud => generate method: create, update, delete.
-q, --query-kind    Kind of query: ValueQuery, OptionQuery (default).
-h, --help          Print help
```
**Example**
```bash
subcli storage value Counter u32
```
Result
```bash
#[pallet::storage]
#[pallet::getter(fn counter)]
pub type Counter<T> = Counter<_, u32>;
```

### Create a new storage map 
```bash
subcli storage map <name> <key> <value>

Arguments:
<name>      Name of project
<key>       Key of storage map
<value>     Value of storage map


Options:
-m, --method        Generate methods for storage. 
                    c -> create
                    u -> update
                    d -> delete
                    Example: -m cud => generate method: create, update, delete.
-q, --query-kind    Kind of query: ValueQuery, OptionQuery (default).
-h, --help          Print help
```



