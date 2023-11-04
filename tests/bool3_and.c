#include <inttypes.h>

struct Input {
    _Bool a;
    _Bool b;
    _Bool c;
};

_Bool bool3_and(struct Input input) {
   return input.a && input.b && input.c;
}
