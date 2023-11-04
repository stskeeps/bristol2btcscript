cd tests
for x in *.c; do 
  NAME=`basename $x .c`
  ~/HyCC/bin/cbmc-gc $NAME.c --minimization-time-limit 60 --bool $NAME --function $NAME
  ~/HyCC/bin/circuit-utils $NAME.circ --as-scd $NAME.scd
  node ../bristol2btcscript.js $NAME.scd > $NAME.btcscript; 
done
