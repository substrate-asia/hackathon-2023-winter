# Storage
- Value
```
storage -n name -v u32
```
-   Map
```
storage -t map -n mymap -k u32:Blake2_128Concat -v Student
```
-   double map
```
storage -t doublemap -n mydoublemap -k u32:Twox64Concat -k u64:Blake2_128Concat -v u64
```
- n-map
```
storage -t nmap -n mynmap -k Twox64Concat:u64 -k Blake2_128Concat:u32 -k Blake2_128:i64 -v u64
```

# Struct
```
struct -n MyStruct -p name:String -p age:u32
```

# Extrinsic
```
extrinsic -n MyExtrinsic -i 100 -v u32 -w 10
```

# Event
```
event -n MyEvent
```

# Error
```
error -v NoneValue -v StorageOverflow
```