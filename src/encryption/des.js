//Paul Tero, July 2001
//http://www.tero.co.uk/des/
//
//Optimised for performance with large blocks by Michael Hayworth, November 2001
//http://www.netdealing.com
//
//THIS SOFTWARE IS PROVIDED "AS IS" AND
//ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
//FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
//DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
//OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
//HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
//LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
//OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
//SUCH DAMAGE.
//des
//this takes the key, the message, and whether to encrypt or decrypt

export function des(key, message, encrypt, mode, iv, padding) {
    var spfunction1 = new Array(
        0x1010400,
        0,
        0x10000,
        0x1010404,
        0x1010004,
        0x10404,
        0x4,
        0x10000,
        0x400,
        0x1010400,
        0x1010404,
        0x400,
        0x1000404,
        0x1010004,
        0x1000000,
        0x4,
        0x404,
        0x1000400,
        0x1000400,
        0x10400,
        0x10400,
        0x1010000,
        0x1010000,
        0x1000404,
        0x10004,
        0x1000004,
        0x1000004,
        0x10004,
        0,
        0x404,
        0x10404,
        0x1000000,
        0x10000,
        0x1010404,
        0x4,
        0x1010000,
        0x1010400,
        0x1000000,
        0x1000000,
        0x400,
        0x1010004,
        0x10000,
        0x10400,
        0x1000004,
        0x400,
        0x4,
        0x1000404,
        0x10404,
        0x1010404,
        0x10004,
        0x1010000,
        0x1000404,
        0x1000004,
        0x404,
        0x10404,
        0x1010400,
        0x404,
        0x1000400,
        0x1000400,
        0,
        0x10004,
        0x10400,
        0,
        0x1010004,
    );
    var spfunction2 = new Array(
        -0x7fef7fe0,
        -0x7fff8000,
        0x8000,
        0x108020,
        0x100000,
        0x20,
        -0x7fefffe0,
        -0x7fff7fe0,
        -0x7fffffe0,
        -0x7fef7fe0,
        -0x7fef8000,
        -0x80000000,
        -0x7fff8000,
        0x100000,
        0x20,
        -0x7fefffe0,
        0x108000,
        0x100020,
        -0x7fff7fe0,
        0,
        -0x80000000,
        0x8000,
        0x108020,
        -0x7ff00000,
        0x100020,
        -0x7fffffe0,
        0,
        0x108000,
        0x8020,
        -0x7fef8000,
        -0x7ff00000,
        0x8020,
        0,
        0x108020,
        -0x7fefffe0,
        0x100000,
        -0x7fff7fe0,
        -0x7ff00000,
        -0x7fef8000,
        0x8000,
        -0x7ff00000,
        -0x7fff8000,
        0x20,
        -0x7fef7fe0,
        0x108020,
        0x20,
        0x8000,
        -0x80000000,
        0x8020,
        -0x7fef8000,
        0x100000,
        -0x7fffffe0,
        0x100020,
        -0x7fff7fe0,
        -0x7fffffe0,
        0x100020,
        0x108000,
        0,
        -0x7fff8000,
        0x8020,
        -0x80000000,
        -0x7fefffe0,
        -0x7fef7fe0,
        0x108000,
    );
    var spfunction3 = new Array(
        0x208,
        0x8020200,
        0,
        0x8020008,
        0x8000200,
        0,
        0x20208,
        0x8000200,
        0x20008,
        0x8000008,
        0x8000008,
        0x20000,
        0x8020208,
        0x20008,
        0x8020000,
        0x208,
        0x8000000,
        0x8,
        0x8020200,
        0x200,
        0x20200,
        0x8020000,
        0x8020008,
        0x20208,
        0x8000208,
        0x20200,
        0x20000,
        0x8000208,
        0x8,
        0x8020208,
        0x200,
        0x8000000,
        0x8020200,
        0x8000000,
        0x20008,
        0x208,
        0x20000,
        0x8020200,
        0x8000200,
        0,
        0x200,
        0x20008,
        0x8020208,
        0x8000200,
        0x8000008,
        0x200,
        0,
        0x8020008,
        0x8000208,
        0x20000,
        0x8000000,
        0x8020208,
        0x8,
        0x20208,
        0x20200,
        0x8000008,
        0x8020000,
        0x8000208,
        0x208,
        0x8020000,
        0x20208,
        0x8,
        0x8020008,
        0x20200,
    );
    var spfunction4 = new Array(
        0x802001,
        0x2081,
        0x2081,
        0x80,
        0x802080,
        0x800081,
        0x800001,
        0x2001,
        0,
        0x802000,
        0x802000,
        0x802081,
        0x81,
        0,
        0x800080,
        0x800001,
        0x1,
        0x2000,
        0x800000,
        0x802001,
        0x80,
        0x800000,
        0x2001,
        0x2080,
        0x800081,
        0x1,
        0x2080,
        0x800080,
        0x2000,
        0x802080,
        0x802081,
        0x81,
        0x800080,
        0x800001,
        0x802000,
        0x802081,
        0x81,
        0,
        0,
        0x802000,
        0x2080,
        0x800080,
        0x800081,
        0x1,
        0x802001,
        0x2081,
        0x2081,
        0x80,
        0x802081,
        0x81,
        0x1,
        0x2000,
        0x800001,
        0x2001,
        0x802080,
        0x800081,
        0x2001,
        0x2080,
        0x800000,
        0x802001,
        0x80,
        0x800000,
        0x2000,
        0x802080,
    );
    var spfunction5 = new Array(
        0x100,
        0x2080100,
        0x2080000,
        0x42000100,
        0x80000,
        0x100,
        0x40000000,
        0x2080000,
        0x40080100,
        0x80000,
        0x2000100,
        0x40080100,
        0x42000100,
        0x42080000,
        0x80100,
        0x40000000,
        0x2000000,
        0x40080000,
        0x40080000,
        0,
        0x40000100,
        0x42080100,
        0x42080100,
        0x2000100,
        0x42080000,
        0x40000100,
        0,
        0x42000000,
        0x2080100,
        0x2000000,
        0x42000000,
        0x80100,
        0x80000,
        0x42000100,
        0x100,
        0x2000000,
        0x40000000,
        0x2080000,
        0x42000100,
        0x40080100,
        0x2000100,
        0x40000000,
        0x42080000,
        0x2080100,
        0x40080100,
        0x100,
        0x2000000,
        0x42080000,
        0x42080100,
        0x80100,
        0x42000000,
        0x42080100,
        0x2080000,
        0,
        0x40080000,
        0x42000000,
        0x80100,
        0x2000100,
        0x40000100,
        0x80000,
        0,
        0x40080000,
        0x2080100,
        0x40000100,
    );
    var spfunction6 = new Array(
        0x20000010,
        0x20400000,
        0x4000,
        0x20404010,
        0x20400000,
        0x10,
        0x20404010,
        0x400000,
        0x20004000,
        0x404010,
        0x400000,
        0x20000010,
        0x400010,
        0x20004000,
        0x20000000,
        0x4010,
        0,
        0x400010,
        0x20004010,
        0x4000,
        0x404000,
        0x20004010,
        0x10,
        0x20400010,
        0x20400010,
        0,
        0x404010,
        0x20404000,
        0x4010,
        0x404000,
        0x20404000,
        0x20000000,
        0x20004000,
        0x10,
        0x20400010,
        0x404000,
        0x20404010,
        0x400000,
        0x4010,
        0x20000010,
        0x400000,
        0x20004000,
        0x20000000,
        0x4010,
        0x20000010,
        0x20404010,
        0x404000,
        0x20400000,
        0x404010,
        0x20404000,
        0,
        0x20400010,
        0x10,
        0x4000,
        0x20400000,
        0x404010,
        0x4000,
        0x400010,
        0x20004010,
        0,
        0x20404000,
        0x20000000,
        0x400010,
        0x20004010,
    );
    var spfunction7 = new Array(
        0x200000,
        0x4200002,
        0x4000802,
        0,
        0x800,
        0x4000802,
        0x200802,
        0x4200800,
        0x4200802,
        0x200000,
        0,
        0x4000002,
        0x2,
        0x4000000,
        0x4200002,
        0x802,
        0x4000800,
        0x200802,
        0x200002,
        0x4000800,
        0x4000002,
        0x4200000,
        0x4200800,
        0x200002,
        0x4200000,
        0x800,
        0x802,
        0x4200802,
        0x200800,
        0x2,
        0x4000000,
        0x200800,
        0x4000000,
        0x200800,
        0x200000,
        0x4000802,
        0x4000802,
        0x4200002,
        0x4200002,
        0x2,
        0x200002,
        0x4000000,
        0x4000800,
        0x200000,
        0x4200800,
        0x802,
        0x200802,
        0x4200800,
        0x802,
        0x4000002,
        0x4200802,
        0x4200000,
        0x200800,
        0,
        0x2,
        0x4200802,
        0,
        0x200802,
        0x4200000,
        0x800,
        0x4000002,
        0x4000800,
        0x800,
        0x200002,
    );
    var spfunction8 = new Array(
        0x10001040,
        0x1000,
        0x40000,
        0x10041040,
        0x10000000,
        0x10001040,
        0x40,
        0x10000000,
        0x40040,
        0x10040000,
        0x10041040,
        0x41000,
        0x10041000,
        0x41040,
        0x1000,
        0x40,
        0x10040000,
        0x10000040,
        0x10001000,
        0x1040,
        0x41000,
        0x40040,
        0x10040040,
        0x10041000,
        0x1040,
        0,
        0,
        0x10040040,
        0x10000040,
        0x10001000,
        0x41040,
        0x40000,
        0x41040,
        0x40000,
        0x10041000,
        0x1000,
        0x40,
        0x10040040,
        0x1000,
        0x41040,
        0x10001000,
        0x40,
        0x10000040,
        0x10040000,
        0x10040040,
        0x10000000,
        0x40000,
        0x10001040,
        0,
        0x10041040,
        0x40040,
        0x10000040,
        0x10040000,
        0x10001000,
        0x10001040,
        0,
        0x10041040,
        0x41000,
        0x41000,
        0x1040,
        0x1040,
        0x40040,
        0x10000000,
        0x10041000,
    );
    var keys = des_createKeys(key.toString());
    var m = 0,
        i,
        j,
        temp,
        temp2,
        right1,
        right2,
        left,
        right,
        looping;
    var cbcleft, cbcleft2, cbcright, cbcright2, result, tempresult;
    var endloop, loopinc;
    var len = message.length;
    var chunk = 0;
    var iterations = keys.length == 32 ? 3 : 9;
    if (iterations == 3) {
        looping = encrypt ? new Array(0, 32, 2) : new Array(30, -2, -2);
    } else {
        looping = encrypt ? new Array(0, 32, 2, 62, 30, -2, 64, 96, 2) : new Array(94, 62, -2, 32, 64, 2, 30, -2, -2);
    }
    if (padding == 2) {
        message += "        ";
    } else if (padding == 1) {
        temp = 8 - (len % 8);
        message += String.fromCharCode(temp, temp, temp, temp, temp, temp, temp, temp);
        if (temp == 8) {
            len += 8;
        }
    } else if (!padding) {
        message += "\0\0\0\0\0\0\0\0";
    }
    result = "";
    tempresult = "";
    if (mode == 1) {
        cbcleft = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
        cbcright = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
        m = 0;
    }
    while (m < len) {
        left = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);
        right =
            (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);
        if (mode == 1) {
            if (encrypt) {
                left ^= cbcleft;
                right ^= cbcright;
            } else {
                cbcleft2 = cbcleft;
                cbcright2 = cbcright;
                cbcleft = left;
                cbcright = right;
            }
        }
        temp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
        right ^= temp;
        left ^= temp << 4;
        temp = ((left >>> 16) ^ right) & 0x0000ffff;
        right ^= temp;
        left ^= temp << 16;
        temp = ((right >>> 2) ^ left) & 0x33333333;
        left ^= temp;
        right ^= temp << 2;
        temp = ((right >>> 8) ^ left) & 0x00ff00ff;
        left ^= temp;
        right ^= temp << 8;
        temp = ((left >>> 1) ^ right) & 0x55555555;
        right ^= temp;
        left ^= temp << 1;
        left = (left << 1) | (left >>> 31);
        right = (right << 1) | (right >>> 31);
        for (j = 0; j < iterations; j += 3) {
            endloop = looping[j + 1];
            loopinc = looping[j + 2];
            for (i = looping[j]; i != endloop; i += loopinc) {
                right1 = right ^ keys[i];
                right2 = ((right >>> 4) | (right << 28)) ^ keys[i + 1];
                temp = left;
                left = right;
                right =
                    temp ^
                    (spfunction2[(right1 >>> 24) & 0x3f] |
                        spfunction4[(right1 >>> 16) & 0x3f] |
                        spfunction6[(right1 >>> 8) & 0x3f] |
                        spfunction8[right1 & 0x3f] |
                        spfunction1[(right2 >>> 24) & 0x3f] |
                        spfunction3[(right2 >>> 16) & 0x3f] |
                        spfunction5[(right2 >>> 8) & 0x3f] |
                        spfunction7[right2 & 0x3f]);
            }
            temp = left;
            left = right;
            right = temp;
        }
        left = (left >>> 1) | (left << 31);
        right = (right >>> 1) | (right << 31);
        temp = ((left >>> 1) ^ right) & 0x55555555;
        right ^= temp;
        left ^= temp << 1;
        temp = ((right >>> 8) ^ left) & 0x00ff00ff;
        left ^= temp;
        right ^= temp << 8;
        temp = ((right >>> 2) ^ left) & 0x33333333;
        left ^= temp;
        right ^= temp << 2;
        temp = ((left >>> 16) ^ right) & 0x0000ffff;
        right ^= temp;
        left ^= temp << 16;
        temp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
        right ^= temp;
        left ^= temp << 4;
        if (mode == 1) {
            if (encrypt) {
                cbcleft = left;
                cbcright = right;
            } else {
                left ^= cbcleft2;
                right ^= cbcright2;
            }
        }
        tempresult += String.fromCharCode(
            left >>> 24,
            (left >>> 16) & 0xff,
            (left >>> 8) & 0xff,
            left & 0xff,
            right >>> 24,
            (right >>> 16) & 0xff,
            (right >>> 8) & 0xff,
            right & 0xff,
        );
        chunk += 8;
        if (chunk == 512) {
            result += tempresult;
            tempresult = "";
            chunk = 0;
        }
    }
    return result + tempresult;
}

export function des_createKeys(key) {
    var pc2bytes0 = new Array(
        0,
        0x4,
        0x20000000,
        0x20000004,
        0x10000,
        0x10004,
        0x20010000,
        0x20010004,
        0x200,
        0x204,
        0x20000200,
        0x20000204,
        0x10200,
        0x10204,
        0x20010200,
        0x20010204,
    );
    var pc2bytes1 = new Array(
        0,
        0x1,
        0x100000,
        0x100001,
        0x4000000,
        0x4000001,
        0x4100000,
        0x4100001,
        0x100,
        0x101,
        0x100100,
        0x100101,
        0x4000100,
        0x4000101,
        0x4100100,
        0x4100101,
    );
    var pc2bytes2 = new Array(
        0,
        0x8,
        0x800,
        0x808,
        0x1000000,
        0x1000008,
        0x1000800,
        0x1000808,
        0,
        0x8,
        0x800,
        0x808,
        0x1000000,
        0x1000008,
        0x1000800,
        0x1000808,
    );
    var pc2bytes3 = new Array(
        0,
        0x200000,
        0x8000000,
        0x8200000,
        0x2000,
        0x202000,
        0x8002000,
        0x8202000,
        0x20000,
        0x220000,
        0x8020000,
        0x8220000,
        0x22000,
        0x222000,
        0x8022000,
        0x8222000,
    );
    var pc2bytes4 = new Array(
        0,
        0x40000,
        0x10,
        0x40010,
        0,
        0x40000,
        0x10,
        0x40010,
        0x1000,
        0x41000,
        0x1010,
        0x41010,
        0x1000,
        0x41000,
        0x1010,
        0x41010,
    );
    var pc2bytes5 = new Array(
        0,
        0x400,
        0x20,
        0x420,
        0,
        0x400,
        0x20,
        0x420,
        0x2000000,
        0x2000400,
        0x2000020,
        0x2000420,
        0x2000000,
        0x2000400,
        0x2000020,
        0x2000420,
    );
    var pc2bytes6 = new Array(
        0,
        0x10000000,
        0x80000,
        0x10080000,
        0x2,
        0x10000002,
        0x80002,
        0x10080002,
        0,
        0x10000000,
        0x80000,
        0x10080000,
        0x2,
        0x10000002,
        0x80002,
        0x10080002,
    );
    var pc2bytes7 = new Array(
        0,
        0x10000,
        0x800,
        0x10800,
        0x20000000,
        0x20010000,
        0x20000800,
        0x20010800,
        0x20000,
        0x30000,
        0x20800,
        0x30800,
        0x20020000,
        0x20030000,
        0x20020800,
        0x20030800,
    );
    var pc2bytes8 = new Array(
        0,
        0x40000,
        0,
        0x40000,
        0x2,
        0x40002,
        0x2,
        0x40002,
        0x2000000,
        0x2040000,
        0x2000000,
        0x2040000,
        0x2000002,
        0x2040002,
        0x2000002,
        0x2040002,
    );
    var pc2bytes9 = new Array(
        0,
        0x10000000,
        0x8,
        0x10000008,
        0,
        0x10000000,
        0x8,
        0x10000008,
        0x400,
        0x10000400,
        0x408,
        0x10000408,
        0x400,
        0x10000400,
        0x408,
        0x10000408,
    );
    var pc2bytes10 = new Array(
        0,
        0x20,
        0,
        0x20,
        0x100000,
        0x100020,
        0x100000,
        0x100020,
        0x2000,
        0x2020,
        0x2000,
        0x2020,
        0x102000,
        0x102020,
        0x102000,
        0x102020,
    );
    var pc2bytes11 = new Array(
        0,
        0x1000000,
        0x200,
        0x1000200,
        0x200000,
        0x1200000,
        0x200200,
        0x1200200,
        0x4000000,
        0x5000000,
        0x4000200,
        0x5000200,
        0x4200000,
        0x5200000,
        0x4200200,
        0x5200200,
    );
    var pc2bytes12 = new Array(
        0,
        0x1000,
        0x8000000,
        0x8001000,
        0x80000,
        0x81000,
        0x8080000,
        0x8081000,
        0x10,
        0x1010,
        0x8000010,
        0x8001010,
        0x80010,
        0x81010,
        0x8080010,
        0x8081010,
    );
    var pc2bytes13 = new Array(0, 0x4, 0x100, 0x104, 0, 0x4, 0x100, 0x104, 0x1, 0x5, 0x101, 0x105, 0x1, 0x5, 0x101, 0x105);
    var iterations = key.length > 8 ? 3 : 1;
    var keys = new Array(32 * iterations);
    var shifts = new Array(0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0);
    var left,
        right,
        lefttemp,
        righttemp,
        m = 0,
        n = 0,
        temp;
    for (var j = 0; j < iterations; j++) {
        left = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);
        right = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);
        temp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
        right ^= temp;
        left ^= temp << 4;
        temp = ((right >>> -16) ^ left) & 0x0000ffff;
        left ^= temp;
        right ^= temp << -16;
        temp = ((left >>> 2) ^ right) & 0x33333333;
        right ^= temp;
        left ^= temp << 2;
        temp = ((right >>> -16) ^ left) & 0x0000ffff;
        left ^= temp;
        right ^= temp << -16;
        temp = ((left >>> 1) ^ right) & 0x55555555;
        right ^= temp;
        left ^= temp << 1;
        temp = ((right >>> 8) ^ left) & 0x00ff00ff;
        left ^= temp;
        right ^= temp << 8;
        temp = ((left >>> 1) ^ right) & 0x55555555;
        right ^= temp;
        left ^= temp << 1;
        temp = (left << 8) | ((right >>> 20) & 0x000000f0);
        left = (right << 24) | ((right << 8) & 0xff0000) | ((right >>> 8) & 0xff00) | ((right >>> 24) & 0xf0);
        right = temp;
        for (var i = 0; i < shifts.length; i++) {
            if (shifts[i]) {
                left = (left << 2) | (left >>> 26);
                right = (right << 2) | (right >>> 26);
            } else {
                left = (left << 1) | (left >>> 27);
                right = (right << 1) | (right >>> 27);
            }
            left &= -0xf;
            right &= -0xf;
            lefttemp =
                pc2bytes0[left >>> 28] |
                pc2bytes1[(left >>> 24) & 0xf] |
                pc2bytes2[(left >>> 20) & 0xf] |
                pc2bytes3[(left >>> 16) & 0xf] |
                pc2bytes4[(left >>> 12) & 0xf] |
                pc2bytes5[(left >>> 8) & 0xf] |
                pc2bytes6[(left >>> 4) & 0xf];
            righttemp =
                pc2bytes7[right >>> 28] |
                pc2bytes8[(right >>> 24) & 0xf] |
                pc2bytes9[(right >>> 20) & 0xf] |
                pc2bytes10[(right >>> 16) & 0xf] |
                pc2bytes11[(right >>> 12) & 0xf] |
                pc2bytes12[(right >>> 8) & 0xf] |
                pc2bytes13[(right >>> 4) & 0xf];
            temp = ((righttemp >>> 16) ^ lefttemp) & 0x0000ffff;
            keys[n++] = lefttemp ^ temp;
            keys[n++] = righttemp ^ (temp << 16);
        }
    }
    return keys;
}

export function stringToHex(s) {
    var r = "";
    var hexes = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
    for (var i = 0; i < s.length; i++) {
        r += hexes[s.charCodeAt(i) >> 4] + hexes[s.charCodeAt(i) & 0xf];
    }
    return r;
}

export function hexToString(h) {
    var r = "";
    for (var i = h.substr(0, 2) == "0x" ? 2 : 0; i < h.length; i += 2) {
        r += String.fromCharCode(parseInt(h.substr(i, 2), 16));
    }
    return r;
}

var keyVal;

export function setKeyString(val) {
    keyVal = val;
}

var ConvertBase = function(num) {
    return {
        from: function(baseFrom) {
            return {
                to: function(baseTo) {
                    return parseInt(num, baseFrom).toString(baseTo);
                },
            };
        },
    };
};

// binary to decimal
ConvertBase.bin2dec = function(num) {
    return ConvertBase(num)
        .from(2)
        .to(10);
};

// binary to hexadecimal
ConvertBase.bin2hex = function(num) {
    return ConvertBase(num)
        .from(2)
        .to(16);
};

// decimal to binary
ConvertBase.dec2bin = function(num) {
    return ConvertBase(num)
        .from(10)
        .to(2);
};

// decimal to hexadecimal
ConvertBase.dec2hex = function(num) {
    return ConvertBase(num)
        .from(10)
        .to(16);
};

// hexadecimal to binary
ConvertBase.hex2bin = function(num) {
    return ConvertBase(num)
        .from(16)
        .to(2);
};

// hexadecimal to decimal
ConvertBase.hex2dec = function(num) {
    return ConvertBase(num)
        .from(16)
        .to(10);
};

//special value stored in x[0] to indicate a problem
var ERROR_VAL = -9876;

//initial permutation (split into left/right halves )
//since DES numbers bits starting at 1, we will ignore x[0]
var IP_perm = new Array(
    -1,
    58,
    50,
    42,
    34,
    26,
    18,
    10,
    2,
    60,
    52,
    44,
    36,
    28,
    20,
    12,
    4,
    62,
    54,
    46,
    38,
    30,
    22,
    14,
    6,
    64,
    56,
    48,
    40,
    32,
    24,
    16,
    8,
    57,
    49,
    41,
    33,
    25,
    17,
    9,
    1,
    59,
    51,
    43,
    35,
    27,
    19,
    11,
    3,
    61,
    53,
    45,
    37,
    29,
    21,
    13,
    5,
    63,
    55,
    47,
    39,
    31,
    23,
    15,
    7,
);

//final permutation (inverse initial permutation)
var FP_perm = new Array(
    -1,
    40,
    8,
    48,
    16,
    56,
    24,
    64,
    32,
    39,
    7,
    47,
    15,
    55,
    23,
    63,
    31,
    38,
    6,
    46,
    14,
    54,
    22,
    62,
    30,
    37,
    5,
    45,
    13,
    53,
    21,
    61,
    29,
    36,
    4,
    44,
    12,
    52,
    20,
    60,
    28,
    35,
    3,
    43,
    11,
    51,
    19,
    59,
    27,
    34,
    2,
    42,
    10,
    50,
    18,
    58,
    26,
    33,
    1,
    41,
    9,
    49,
    17,
    57,
    25,
);

//per-round expansion
var E_perm = new Array(
    -1,
    32,
    1,
    2,
    3,
    4,
    5,
    4,
    5,
    6,
    7,
    8,
    9,
    8,
    9,
    10,
    11,
    12,
    13,
    12,
    13,
    14,
    15,
    16,
    17,
    16,
    17,
    18,
    19,
    20,
    21,
    20,
    21,
    22,
    23,
    24,
    25,
    24,
    25,
    26,
    27,
    28,
    29,
    28,
    29,
    30,
    31,
    32,
    1,
);

//per-round permutation
var P_perm = new Array(
    -1,
    16,
    7,
    20,
    21,
    29,
    12,
    28,
    17,
    1,
    15,
    23,
    26,
    5,
    18,
    31,
    10,
    2,
    8,
    24,
    14,
    32,
    27,
    3,
    9,
    19,
    13,
    30,
    6,
    22,
    11,
    4,
    25,
);

//note we do use element 0 in the S-Boxes
var S1 = new Array(
    14,
    4,
    13,
    1,
    2,
    15,
    11,
    8,
    3,
    10,
    6,
    12,
    5,
    9,
    0,
    7,
    0,
    15,
    7,
    4,
    14,
    2,
    13,
    1,
    10,
    6,
    12,
    11,
    9,
    5,
    3,
    8,
    4,
    1,
    14,
    8,
    13,
    6,
    2,
    11,
    15,
    12,
    9,
    7,
    3,
    10,
    5,
    0,
    15,
    12,
    8,
    2,
    4,
    9,
    1,
    7,
    5,
    11,
    3,
    14,
    10,
    0,
    6,
    13,
);
var S2 = new Array(
    15,
    1,
    8,
    14,
    6,
    11,
    3,
    4,
    9,
    7,
    2,
    13,
    12,
    0,
    5,
    10,
    3,
    13,
    4,
    7,
    15,
    2,
    8,
    14,
    12,
    0,
    1,
    10,
    6,
    9,
    11,
    5,
    0,
    14,
    7,
    11,
    10,
    4,
    13,
    1,
    5,
    8,
    12,
    6,
    9,
    3,
    2,
    15,
    13,
    8,
    10,
    1,
    3,
    15,
    4,
    2,
    11,
    6,
    7,
    12,
    0,
    5,
    14,
    9,
);
var S3 = new Array(
    10,
    0,
    9,
    14,
    6,
    3,
    15,
    5,
    1,
    13,
    12,
    7,
    11,
    4,
    2,
    8,
    13,
    7,
    0,
    9,
    3,
    4,
    6,
    10,
    2,
    8,
    5,
    14,
    12,
    11,
    15,
    1,
    13,
    6,
    4,
    9,
    8,
    15,
    3,
    0,
    11,
    1,
    2,
    12,
    5,
    10,
    14,
    7,
    1,
    10,
    13,
    0,
    6,
    9,
    8,
    7,
    4,
    15,
    14,
    3,
    11,
    5,
    2,
    12,
);
var S4 = new Array(
    7,
    13,
    14,
    3,
    0,
    6,
    9,
    10,
    1,
    2,
    8,
    5,
    11,
    12,
    4,
    15,
    13,
    8,
    11,
    5,
    6,
    15,
    0,
    3,
    4,
    7,
    2,
    12,
    1,
    10,
    14,
    9,
    10,
    6,
    9,
    0,
    12,
    11,
    7,
    13,
    15,
    1,
    3,
    14,
    5,
    2,
    8,
    4,
    3,
    15,
    0,
    6,
    10,
    1,
    13,
    8,
    9,
    4,
    5,
    11,
    12,
    7,
    2,
    14,
);
var S5 = new Array(
    2,
    12,
    4,
    1,
    7,
    10,
    11,
    6,
    8,
    5,
    3,
    15,
    13,
    0,
    14,
    9,
    14,
    11,
    2,
    12,
    4,
    7,
    13,
    1,
    5,
    0,
    15,
    10,
    3,
    9,
    8,
    6,
    4,
    2,
    1,
    11,
    10,
    13,
    7,
    8,
    15,
    9,
    12,
    5,
    6,
    3,
    0,
    14,
    11,
    8,
    12,
    7,
    1,
    14,
    2,
    13,
    6,
    15,
    0,
    9,
    10,
    4,
    5,
    3,
);
var S6 = new Array(
    12,
    1,
    10,
    15,
    9,
    2,
    6,
    8,
    0,
    13,
    3,
    4,
    14,
    7,
    5,
    11,
    10,
    15,
    4,
    2,
    7,
    12,
    9,
    5,
    6,
    1,
    13,
    14,
    0,
    11,
    3,
    8,
    9,
    14,
    15,
    5,
    2,
    8,
    12,
    3,
    7,
    0,
    4,
    10,
    1,
    13,
    11,
    6,
    4,
    3,
    2,
    12,
    9,
    5,
    15,
    10,
    11,
    14,
    1,
    7,
    6,
    0,
    8,
    13,
);
var S7 = new Array(
    4,
    11,
    2,
    14,
    15,
    0,
    8,
    13,
    3,
    12,
    9,
    7,
    5,
    10,
    6,
    1,
    13,
    0,
    11,
    7,
    4,
    9,
    1,
    10,
    14,
    3,
    5,
    12,
    2,
    15,
    8,
    6,
    1,
    4,
    11,
    13,
    12,
    3,
    7,
    14,
    10,
    15,
    6,
    8,
    0,
    5,
    9,
    2,
    6,
    11,
    13,
    8,
    1,
    4,
    10,
    7,
    9,
    5,
    0,
    15,
    14,
    2,
    3,
    12,
);
var S8 = new Array(
    13,
    2,
    8,
    4,
    6,
    15,
    11,
    1,
    10,
    9,
    3,
    14,
    5,
    0,
    12,
    7,
    1,
    15,
    13,
    8,
    10,
    3,
    7,
    4,
    12,
    5,
    6,
    11,
    0,
    14,
    9,
    2,
    7,
    11,
    4,
    1,
    9,
    12,
    14,
    2,
    0,
    6,
    10,
    13,
    15,
    3,
    5,
    8,
    2,
    1,
    14,
    7,
    4,
    10,
    8,
    13,
    15,
    12,
    9,
    0,
    3,
    5,
    6,
    11,
);

//, first, key, permutation
var PC_1_perm = new Array(
    -1,
    // C subkey bits
    57,
    49,
    41,
    33,
    25,
    17,
    9,
    1,
    58,
    50,
    42,
    34,
    26,
    18,
    10,
    2,
    59,
    51,
    43,
    35,
    27,
    19,
    11,
    3,
    60,
    52,
    44,
    36,
    // D subkey bits
    63,
    55,
    47,
    39,
    31,
    23,
    15,
    7,
    62,
    54,
    46,
    38,
    30,
    22,
    14,
    6,
    61,
    53,
    45,
    37,
    29,
    21,
    13,
    5,
    28,
    20,
    12,
    4,
);

//, per-round, key, selection, permutation
var PC_2_perm = new Array(
    -1,
    14,
    17,
    11,
    24,
    1,
    5,
    3,
    28,
    15,
    6,
    21,
    10,
    23,
    19,
    12,
    4,
    26,
    8,
    16,
    7,
    27,
    20,
    13,
    2,
    41,
    52,
    31,
    37,
    47,
    55,
    30,
    40,
    51,
    45,
    33,
    48,
    44,
    49,
    39,
    56,
    34,
    53,
    46,
    42,
    50,
    36,
    29,
    32,
);

//save output in case we want to reformat it later
var DES_output = new Array(65);

//remove spaces from input
function remove_spaces(instr) {
    var i;
    var outstr = "";

    for (i = 0; i < instr.length; i++) {
        if (instr.charAt(i) != " ") {
            // not a space, include it
            outstr += instr.charAt(i);
        }
    }

    return outstr;
}

//split an integer into bits
//ary   = array to store bits in
//start = starting subscript
//bitc  = number of bits to convert
//val   = number to convert
function split_int(ary, start, bitc, val) {
    var i = start;
    var j;
    for (j = bitc - 1; j >= 0; j--) {
        // isolate low-order bit
        ary[i + j] = val & 1;
        // remove that bit
        val >>= 1;
    }
}

//get the message to encrypt/decrypt
function get_value(bitarray, str, isASCII) {
    var i;
    var val; // one hex digit

    // insert note we probably are ok
    bitarray[0] = -1;

    if (isASCII) {
        // check length of data
        if (str.length != 8) {
            bitarray[0] = ERROR_VAL;
            return;
        }

        // have ASCII data
        for (i = 0; i < 8; i++) {
            split_int(bitarray, i * 8 + 1, 8, str.charCodeAt(i));
        }
    } else {
        // have hex data - remove any spaces they used, then convert
        str = remove_spaces(str);

        // check length of data
        if (str.length != 16) {
            bitarray[0] = ERROR_VAL;
            return;
        }

        for (i = 0; i < 16; i++) {
            // get the next hex digit
            val = str.charCodeAt(i);

            // do some error checking
            if (val >= 48 && val <= 57) {
                // have a valid digit 0-9
                val -= 48;
            } else if (val >= 65 && val <= 70) {
                // have a valid digit A-F
                val -= 55;
            } else if (val >= 97 && val <= 102) {
                // have a valid digit A-F
                val -= 87;
            } else {
                bitarray[0] = ERROR_VAL;
                return;
            }

            // add this digit to the array
            split_int(bitarray, i * 4 + 1, 4, val - 48);
        }
    }
}

//format the output in the desired form
//if -1, use existing value
//-- uses the global array DES_output
function format_DES_output() {
    var i;
    var bits;
    var str = "";
    // output hexdecimal data
    for (i = 1; i <= 64; i += 4) {
        bits = DES_output[i] * 8 + DES_output[i + 1] * 4 + DES_output[i + 2] * 2 + DES_output[i + 3];

        // 0-9 or A-F?
        if (bits <= 9) {
            str += String.fromCharCode(bits + 48);
        } else {
            str += String.fromCharCode(bits + 87);
        }
    }

    return str;
}

//copy bits in a permutation
//dest = where to copy the bits to
//src  = Where to copy the bits from
//perm = The order to copy/permute the bits
//note: since DES ingores x[0], we do also
function permute(dest, src, perm) {
    var i;
    var fromloc;

    for (i = 1; i < perm.length; i++) {
        fromloc = perm[i];
        dest[i] = src[fromloc];
    }
}

//do an array XOR
//assume all array entries are 0 or 1
function xor(a1, a2) {
    var i;

    for (i = 1; i < a1.length; i++) {
        a1[i] = a1[i] ^ a2[i];
    }
}

//process one S-Box, return integer from S-Box
function do_S(SBox, index, inbits) {
    // collect the 6 bits into a single integer
    var S_index =
        inbits[index] * 32 +
        inbits[index + 5] * 16 +
        inbits[index + 1] * 8 +
        inbits[index + 2] * 4 +
        inbits[index + 3] * 2 +
        inbits[index + 4];

    // do lookup
    return SBox[S_index];
}

//do one round of DES encryption
function des_round(L, R, KeyR) {
    var E_result = new Array(49);
    var S_out = new Array(33);

    // copy the existing L bits, then set new L = old R
    var temp_L = new Array(33);
    for (let i = 0; i < 33; i++) {
        // copy exising L bits
        temp_L[i] = L[i];

        // set L = R
        L[i] = R[i];
    }

    // expand R using E permutation
    permute(E_result, R, E_perm);

    // exclusive-or with current key
    xor(E_result, KeyR);

    // put through the S-Boxes
    split_int(S_out, 1, 4, do_S(S1, 1, E_result));
    split_int(S_out, 5, 4, do_S(S2, 7, E_result));
    split_int(S_out, 9, 4, do_S(S3, 13, E_result));
    split_int(S_out, 13, 4, do_S(S4, 19, E_result));
    split_int(S_out, 17, 4, do_S(S5, 25, E_result));
    split_int(S_out, 21, 4, do_S(S6, 31, E_result));
    split_int(S_out, 25, 4, do_S(S7, 37, E_result));
    split_int(S_out, 29, 4, do_S(S8, 43, E_result));

    // do the P permutation
    permute(R, S_out, P_perm);

    // xor this with old L to get the new R
    xor(R, temp_L);
}

//shift the CD values left 1 bit
function shift_CD_1(CD) {
    var i;

    // note we use [0] to hold the bit shifted around the end
    for (i = 0; i <= 55; i++) {
        CD[i] = CD[i + 1];
    }

    // shift D bit around end
    CD[56] = CD[28];
    // shift C bit around end
    CD[28] = CD[0];
}

//shift the CD values left 2 bits
function shift_CD_2(CD) {
    var i;
    var C1 = CD[1];

    // note we use [0] to hold the bit shifted around the end
    for (i = 0; i <= 54; i++) {
        CD[i] = CD[i + 2];
    }

    // shift D bits around end
    CD[55] = CD[27];
    CD[56] = CD[28];
    // shift C bits around end
    CD[27] = C1;
    CD[28] = CD[0];
}

//do the actual DES encryption/decryption
function des_encrypt(inData, Key, do_encrypt) {
    var tempData = new Array(65); // output bits
    var CD = new Array(57); // halves of current key
    var KS = new Array(16); // per-round key schedules
    var L = new Array(33); // left half of current data
    var R = new Array(33); // right half of current data
    var result = new Array(65); // DES output
    var i;

    // do the initial key permutation
    permute(CD, Key, PC_1_perm);

    // create the subkeys
    for (i = 1; i <= 16; i++) {
        // create a new array for each round
        KS[i] = new Array(49);

        // how much should we shift C and D?
        if (i == 1 || i == 2 || i == 9 || i == 16) {
            shift_CD_1(CD);
        } else {
            shift_CD_2(CD);
        }

        // create the actual subkey
        permute(KS[i], CD, PC_2_perm);
    }

    // handle the initial permutation
    permute(tempData, inData, IP_perm);

    // split data into L/R parts
    for (i = 1; i <= 32; i++) {
        L[i] = tempData[i];
        R[i] = tempData[i + 32];
    }

    // encrypting or decrypting?
    if (do_encrypt) {
        // encrypting
        for (i = 1; i <= 16; i++) {
            des_round(L, R, KS[i]);
        }
    } else {
        // decrypting
        for (i = 16; i >= 1; i--) {
            des_round(L, R, KS[i]);
        }
    }

    // create the 64-bit preoutput block = R16/L16
    for (i = 1; i <= 32; i++) {
        // copy R bits into left half of block, L bits into right half
        tempData[i] = R[i];
        tempData[i + 32] = L[i];
    }

    // do final permutation and return result
    permute(result, tempData, FP_perm);
    return result;
}

var inData = new Array(65); // input message bits
var Key = new Array(65);

//do encrytion/decryption
//do_encrypt is TRUE for encrypt, FALSE for decrypt
function do_des(do_encrypt) {
    // get the message from the user
    // also check if it is ASCII or hex
    //get_value( inData, document.stuff.indata.value,
    //document.stuff.intype[0].checked );

    // problems??
    if (inData[0] == ERROR_VAL) {
        // document.stuff.details.value = accumulated_output_info;
        return;
    }

    // get the key from the user
    //get_value( Key, document.stuff.key.value, false );
    // problems??
    if (Key[0] == ERROR_VAL) {
        return;
    }

    // do the encryption/decryption, put output in DES_output for display
    DES_output = des_encrypt(inData, Key, do_encrypt);

    // process output
    format_DES_output();
    //document.stuff.details.value = accumulated_output_info;
}

//do Triple-DES encrytion/decryption
//do_encrypt is TRUE for encrypt, FALSE for decrypt
export function do_tdes(key1, key2, inputpin, do_encrypt) {
    var KeyA = new Array(65);
    var KeyB = new Array(65);
    var inData = new Array(65); // input message bits
    var tempdata = new Array(65); // interm result bits

    // get the message from the user
    // also check if it is ASCII or hex
    get_value(inData, inputpin, false);

    // problems??
    if (inData[0] == ERROR_VAL) {
        return;
    }

    // get the key part A from the user
    get_value(KeyA, key1, false);
    // problems??
    if (KeyA[0] == ERROR_VAL) {
        return;
    }

    // get the key part B from the user
    get_value(KeyB, key2, false);
    // problems??
    if (KeyB[0] == ERROR_VAL) {
        return;
    }

    if (do_encrypt) {
        // TDES encrypt = DES encrypt/decrypt/encrypt
        tempdata = des_encrypt(inData, KeyA, true);
        tempdata = des_encrypt(tempdata, KeyB, false);
        DES_output = des_encrypt(tempdata, KeyA, true);
    } else {
        // TDES decrypt = DES decrypt/encrypt/decrypt
        tempdata = des_encrypt(inData, KeyA, false);
        tempdata = des_encrypt(tempdata, KeyB, true);
        DES_output = des_encrypt(tempdata, KeyA, false);
    }

    // process output
    return format_DES_output();
}

export function encryptData(hsmEncKey, val, id, m_SessionId) {
    m_SessionId = m_SessionId.substring(4, m_SessionId.length - 4);
    var sessionKey = "";
    for (var position = 0; m_SessionId.length < 24; position++) {
        m_SessionId = m_SessionId + m_SessionId.substring(0, 24 - m_SessionId.length);
    }
    if (id != "" && id.substring(0, 4) != "7887") {
        var pinblocklen = 16;
        var hsmKey = des(m_SessionId, hexToString(hsmEncKey), 0); //decrypt HSM key
        var firstKey = hsmKey.substring(0, pinblocklen);
        var secondKey = hsmKey.substring(pinblocklen, 32);
        var pinlen = val.length;
        var len = 2 + pinlen;
        var fblock = new Array(pinblocklen - len + 1).join("F");
        val = "0" + pinlen + val + fblock;
        if (id.length < 15) {
            id = new Array(pinblocklen - id.length + 1).join("F");
        }
        id = "0000" + id.substring(id.length - 13, id.length - 1);
        var pinBlock = "";
        for (var _i = 0; _i < val.length; _i++) {
            var pinhex = ConvertBase.hex2dec(val[_i]);
            var cardhex = ConvertBase.hex2dec(id[_i]);

            if (pinhex.length == 3) {
                pinhex = "0" + pinhex;
            }
            if (cardhex.length == 3) {
                cardhex = "0" + cardhex;
            }
            var con = ConvertBase.dec2hex(pinhex ^ cardhex);
            con = con.toUpperCase();
            pinBlock = pinBlock + con;
        }
        return do_tdes(firstKey, secondKey, pinBlock, true);
    } else {
        return stringToHex(des(m_SessionId, val, 1, 0, "", 1));
    }
}
