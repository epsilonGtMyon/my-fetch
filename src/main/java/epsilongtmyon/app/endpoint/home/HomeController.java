package epsilongtmyon.app.endpoint.home;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping({ "", "/", "/home" })
@Controller
public class HomeController {

	@GetMapping
	public String index() {
		return "home/index";
	}
}
