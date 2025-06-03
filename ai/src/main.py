from model.inference import Dlib_api


def main():
    dlib_api = Dlib_api()

    image_path1 = "./src/model/images/1.webp"
    image_path2 = "./src/model/images/2.webp"
    image_path3 = "./src/model/images/3.webp"
    image_path4 = "./src/model/images/4.webp"

    image_list = [image_path2, image_path3, image_path4]

    for image_path in image_list:
        dlib_api.verify(image_path1, image_path)


if __name__ == "__main__":
    main()
