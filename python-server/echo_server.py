import socket

HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
PORT = 65432        # Port to listen on (non-privileged ports are > 1023)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    conn, addr = s.accept()

    with conn:
        print('Connected by', addr)
        while True:
            data = conn.recv(1024)
            if not data:
                conn, addr = s.accept()
                continue
            print(data)
            command, url, http_vers, _ = data.decode('utf8').split(maxsplit=3)
            page = None
            resp = None
            try:
                url = '.' + url
                print(url)
                page = open(url).read()
                resp = "HTTP/1.1 200 OK\n"
            except:
                print("Can't read address")
                resp = "HTTP/1.1 404 NOT FOUND"
                conn.sendall(resp.encode('utf8'))
                conn.close()
                conn, addr = s.accept()
                continue

            conn.sendall(resp.encode('utf8'))
            ctype = "Content-Type:text/plain;\n"
            clength = "Content-Length:" + str(len(page)) + ";\n\n"
            conn.sendall(ctype.encode('utf8'))
            conn.sendall(clength.encode('utf8'))
            conn.sendall(page.encode('utf8'))
            conn.sendall("\n".encode('utf8'))
            conn.close()
            conn, addr = s.accept()
            # conn.sendall(data)
