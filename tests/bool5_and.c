#include <inttypes.h>

struct Input {
    _Bool a;
    _Bool b;
    _Bool c;
    _Bool d;
    _Bool e;
};

_Bool bool5_and(struct Input input) {
   return input.a && input.b && input.c && input.d && input.e;
}
