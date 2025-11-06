/**
 * Section Renderer - Handles section updates following Horizon pattern
 */

/**
 * Fetch and render section HTML
 * @param {string} sectionId - Section ID to render
 * @param {URLSearchParams} [params] - URL parameters
 * @returns {Promise<string>} - Rendered HTML
 */
export async function sectionRenderer(sectionId, params = new URLSearchParams()) {
  const url = new URL(window.location.href);
  
  // Add section ID to params
  params.set('sections', sectionId);
  params.set('sections_url', url.pathname);
  
  // Merge with existing URL params
  url.search = params.toString();

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.sections?.[sectionId] || '';
  } catch (error) {
    console.error('Section renderer error:', error);
    throw error;
  }
}

/**
 * Morph section content using DOM replacement
 * @param {HTMLElement} targetElement - Element to update
 * @param {string} newHTML - New HTML content
 */
export function morphSection(targetElement, newHTML) {
  if (!targetElement) {
    console.error('morphSection: target element not found');
    return;
  }

  const parser = new DOMParser();
  const newDoc = parser.parseFromString(newHTML, 'text/html');
  const newElement = newDoc.querySelector(targetElement.tagName.toLowerCase() + 
    (targetElement.id ? `#${targetElement.id}` : '') +
    (targetElement.className ? `.${targetElement.className.split(' ')[0]}` : ''));

  if (!newElement) {
    console.error('morphSection: new element not found in HTML');
    return;
  }

  // Replace inner content
  targetElement.innerHTML = newElement.innerHTML;

  // Trigger re-initialization of components
  const event = new CustomEvent('section:morphed', {
    detail: { element: targetElement },
    bubbles: true
  });
  targetElement.dispatchEvent(event);
}
