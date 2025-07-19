import sys
import time


def jalanin_lirik():
    # Ubah lirik lagu dan delay hurufnya sesuai yang kalian mau
    lirik = [
        ("Let a nigga brag Pitt", 0.03),
        ("Legend of the fall, took the year like a bandit", 0.05),
        ("Bought mama a crib and a brand new wagon", 0.05),
        ("Now she hit the grocery shop looking lavish", 0.05),
        ("Star Trek roof in that Wraith of Khan", 0.05),
        ("Girls get loose when they hear this song", 0.05),
        ("A hundred on the dash get me close to God", 0.05),
        ("We don't pray for love, we just pray for cars", 0.05),
    ]

    # Ubah delay dari setiap baris lagu (sesuaikan jumlah)
    delay = [0.3, 0.2, 0.3, 0.4, 0.3, 0.3, 0.3, 0.3]
    # Ubah judul lagu
    print("\n== Starboy - The Weeknd ==")
    for i, (baris_lagu, delay_karakter) in enumerate(lirik):
        for karakter in baris_lagu:
            print(karakter, end='')
            sys.stdout.flush()
            time.sleep(delay_karakter)
        time.sleep(delay[i])
        print('')
    # Ganti nama pembuat
    print("// Code by Haikal")


jalanin_lirik()