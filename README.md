jame
====
                                                                          
A JavaScript machine emulator.
                                                                          
## Opcodes
| Opcode | Description |
|--------|-------------|
| `ADD x y  ` | Add, stores result in x |
| `SUB x y  ` | Subtration, stores result in x |
| `MUL x y  ` | Multiplication, stores result in x |
| `DIV x y  ` | Division, stores result in x
| `MOD x y  ` | Modulo, stores result in x
| `CMP x y  ` | Compares the values, stores result in x (0 -> x smaller, 1 -> equal, 2 -> x greater)
| `MRK x    ` | Marks the line with the marker adress stored in x
| `JMP x    ` | Jumps to the marker adress stored in x
| `JIF x y  ` | Jumps to the marker adress stored in x, when y equals 1
| `LDM x y  ` | Loads data from volatile memory into register
| `STM x y  ` | Stores data from register in volatile memory
| `CPY x y  ` | Copies the value from y to x
| `MOV imm x` | Moves the value into register x
| `OUT imm x` | Sends data from the register to the device
| `IN  imm x` | Receives data from the device stack (-1 -> no data available) (not implemented)
| `TIM x    ` | Stores the value of milliseconds since 1.1.1970 in the register