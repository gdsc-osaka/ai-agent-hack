from inference import Dlib_api


def main():
    dlib_api = Dlib_api()

    image_path1 = "./images/1.webp"
    image_path2 = "./images/2.webp"
    image_path3 = "./images/3.webp"
    image_path4 = "./images/4.webp"

    dlib_api.verify(image_path1, image_path4)


if __name__ == "__main__":
    main()
