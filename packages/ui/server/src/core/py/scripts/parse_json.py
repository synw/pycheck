import sys
import json


def main():
    data = json.loads(sys.argv[1])
    print(json.dumps(data))


if __name__ == "__main__":
    main()
