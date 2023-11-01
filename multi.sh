cd tests

for x in u8_*.c; do NAME=`basename $x .c | sed s/u8_/u16_/g`; cp $x $NAME.c; sed -i s/u8/u16/g $NAME.c; sed -i s/uint8_t/uint16_t/g $NAME.c; done
for x in u8_*.c; do NAME=`basename $x .c | sed s/u8_/u32_/g`; cp $x $NAME.c; sed -i s/u8/u32/g $NAME.c; sed -i s/uint8_t/uint32_t/g $NAME.c; done
for x in u8_*.c; do NAME=`basename $x .c | sed s/u8_/u64_/g`; cp $x $NAME.c; sed -i s/u8/u64/g $NAME.c; sed -i s/uint8_t/uint64_t/g $NAME.c; done
for x in u8_*.c; do NAME=`basename $x .c | sed s/u8_/i8_/g`; cp $x $NAME.c; sed -i s/u8/i8/g $NAME.c; sed -i s/uint8_t/int8_t/g $NAME.c; done
for x in u8_*.c; do NAME=`basename $x .c | sed s/u8_/i16_/g`; cp $x $NAME.c; sed -i s/u8/i16/g $NAME.c; sed -i s/uint8_t/int16_t/g $NAME.c; done
for x in u8_*.c; do NAME=`basename $x .c | sed s/u8_/i32_/g`; cp $x $NAME.c; sed -i s/u8/i16/g $NAME.c; sed -i s/uint8_t/int32_t/g $NAME.c; done
for x in u8_*.c; do NAME=`basename $x .c | sed s/u8_/i64_/g`; cp $x $NAME.c; sed -i s/u8/i16/g $NAME.c; sed -i s/uint8_t/int64_t/g $NAME.c; done
