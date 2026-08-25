package murach.email;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import murach.business.User;
import murach.data.UserDB;

public class EmailListServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html; charset=UTF-8");

        String url = "/index.html";

        String action = request.getParameter("action");
        if (action == null) {
            action = "join";
        }

        if (action.equals("join")) {
            url = "/index.html";
        } else if (action.equals("add")) {
            String firstName = request.getParameter("firstName");
            String lastName = request.getParameter("lastName");
            String email = request.getParameter("email");
            String dob = request.getParameter("dob");
            String hearAbout = request.getParameter("hearAbout");
            String[] announcementsArray = request.getParameterValues("announcements");
            String announcements = (announcementsArray != null) ? String.join(", ", announcementsArray) : (request.getParameter("announcements") != null ? request.getParameter("announcements") : "None");
            String contactBy = request.getParameter("contactBy");

            User user = new User(firstName != null ? firstName : "", lastName != null ? lastName : "", email != null ? email : "");
            UserDB.insert(user);

            request.setAttribute("user", user);
            request.setAttribute("firstName", firstName != null ? firstName : "");
            request.setAttribute("lastName", lastName != null ? lastName : "");
            request.setAttribute("email", email != null ? email : "");
            request.setAttribute("dob", dob != null ? dob : "");
            request.setAttribute("hearAbout", hearAbout != null ? hearAbout : "");
            request.setAttribute("announcements", announcements);
            request.setAttribute("contactBy", contactBy != null ? contactBy : "");

            url = "/thanks.jsp";
        }

        getServletContext()
                .getRequestDispatcher(url)
                .forward(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }
}
