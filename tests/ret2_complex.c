#include <inttypes.h>

struct Input {
    _Bool a;
    _Bool b;
    _Bool c;
    _Bool d;
    _Bool e;
    _Bool f;
};

struct Output {
    _Bool o1;
    _Bool o2;
};

struct Output ret2_complex(struct Input input) {
   struct Output output;
   output.o1 = (!input.a || input.b) && (input.c);
   output.o2 = !((input.d) && (input.e || input.f));
   return output;
}
