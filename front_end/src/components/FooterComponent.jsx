import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsGithub } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { MdCopyright } from "react-icons/md";
export default function FooterComponent() {
  return (
    <>
      <Footer container className="border-t-8  border-teal-500">
        <div className="w-full flex flex-col sm:flex-row sm:justify-between ">
          <div>
            <Link
              to="/"
              className=" text-sm font-semibold sm:text-xl dark:text-white"
            >
              <span className="bg-gradient-to-r px-2 py-1 mr-1 sm:mr-2  text-white rounded-lg from-indigo-500 via-purple-500 to-pink-500">
                Mohib's
              </span>
              Blog
            </Link>
          </div>
          <div>
            <div className="grid mt-6 gap-8 sm:mt-0 grid-cols-2 sm:grid-cols-3 sm:gap-10">
              <div className="cursor-pointer">
                <Footer.Title title="about" />
                <Footer.LinkGroup col>
                  <Footer.Link>100 JS projects</Footer.Link>
                  <Footer.Link>Mohib's Blog</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div className="cursor-pointer">
                <Footer.Title title="follow" />
                <Footer.LinkGroup col>
                  <Footer.Link href="https://www.github.com" target="_blank">
                    Github
                  </Footer.Link>
                  <Footer.Link href="https://www.linkedin.com/in/mohib-ali-a144231a4/">
                    Linkedln
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div className="cursor-pointer">
                <Footer.Title title="Legal" />
                <Footer.LinkGroup col>
                  <Footer.Link href="http://www.github.com" target="_blank">
                    Privacy Policy
                  </Footer.Link>
                  <Footer.Link href="http://www.linkedln.com">
                    Terms & Conditions
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
            <div className="flex flex-col gap-y-5 mt-10 sm:items-end sm:mr-5">
              <div className="flex">
                <Footer.Copyright
                  year={new Date().getFullYear()}
                  by="Mohib's Blog"
                />
              </div>
              <div className="flex gap-x-4">
                <Footer.Icon href="" icon={FaLinkedin} />
                <Footer.Icon href="" icon={SiLeetcode} />
                <Footer.Icon href="" icon={BsGithub} />
              </div>
            </div>
          </div>
        </div>
      </Footer>
    </>
  );
}
